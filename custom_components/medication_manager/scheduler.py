"""Reminder scheduler for Medication Manager."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
import logging
from typing import Awaitable, Callable, cast
from uuid import UUID

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.util import dt as dt_util

from .const import (
    CONF_NOTIFY_SERVICE,
    CONF_SNOOZE_MINUTES,
    EVENT_DATA_UPDATED,
)
from .manager import MedicationManager
from .models import Medication, MedicationReminder
from .notifications import (
    DEFAULT_SNOOZE_MINUTES,
    MedicationNotificationEngine,
)

_LOGGER = logging.getLogger(__name__)


class MedicationSchedulerError(HomeAssistantError):
    """Raised when Medication Manager reminder scheduling fails."""


@dataclass(frozen=True, slots=True)
class ScheduledMedicationReminder:
    """Scheduled reminder metadata owned by the reminder scheduler."""

    key: str
    medication_id: UUID
    reminder_time: time
    due_at: datetime


class MedicationReminderScheduler:
    """Schedule medication reminder notifications from stored medication data."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry[object],
        manager: MedicationManager,
        notifications: MedicationNotificationEngine,
        on_mutation: Callable[[], Awaitable[None]] | None = None,
    ) -> None:
        """Initialize the reminder scheduler."""
        _LOGGER.debug("Initializing Medication Manager reminder scheduler")
        try:
            self._hass = hass
            self._entry = entry
            self._manager = manager
            self._notifications = notifications
            self._on_mutation = on_mutation
            self._unsubs: dict[str, CALLBACK_TYPE] = {}
            self._unsub_data_update: CALLBACK_TYPE | None = None
        except Exception as err:
            _LOGGER.exception("Medication Manager scheduler initialization failed")
            raise MedicationSchedulerError(
                "Не удалось инициализировать планировщик"
            ) from err

    async def async_start(self) -> None:
        """Start reminder scheduling."""
        _LOGGER.debug("Starting Medication Manager reminder scheduler")
        try:
            if self._unsub_data_update is not None:
                _LOGGER.debug("Medication Manager reminder scheduler is running")
                return
            self._unsub_data_update = self._hass.bus.async_listen(
                EVENT_DATA_UPDATED,
                self._async_handle_data_update,
            )
            await self.async_reschedule()
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager scheduler start failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager scheduler start error")
            raise MedicationSchedulerError(
                "Не удалось запустить планировщик"
            ) from err

    async def async_stop(self) -> None:
        """Stop reminder scheduling."""
        _LOGGER.debug("Stopping Medication Manager reminder scheduler")
        try:
            if self._unsub_data_update is not None:
                self._unsub_data_update()
                self._unsub_data_update = None
            self._cancel_all()
        except Exception as err:
            _LOGGER.exception("Medication Manager scheduler stop failed")
            raise MedicationSchedulerError(
                "Не удалось остановить планировщик"
            ) from err

    async def async_reschedule(self) -> None:
        """Reschedule reminders from the latest medication snapshot."""
        _LOGGER.debug("Rescheduling Medication Manager reminders")
        try:
            self._cancel_all()
            notify_service = _notify_service_from_entry(self._entry)
            if notify_service is None:
                _LOGGER.debug("Medication Manager notify service is not configured")
                return

            data = await self._manager.async_get_snapshot()
            now = dt_util.now()
            for medication in data.medications.values():
                self._schedule_medication(medication, now)
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager reminder reschedule failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager reschedule error")
            raise MedicationSchedulerError(
                "Не удалось перепланировать напоминания"
            ) from err

    async def _async_handle_data_update(self, _event: Event[object]) -> None:
        """Reschedule reminders after medication data changes."""
        _LOGGER.debug("Handling Medication Manager data update for scheduler")
        try:
            await self.async_reschedule()
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager scheduler data update failed")
        except Exception:
            _LOGGER.exception("Unexpected Medication Manager scheduler update error")

    def _schedule_medication(self, medication: Medication, now: datetime) -> None:
        """Schedule every enabled reminder for one medication."""
        _LOGGER.debug("Scheduling reminders for Medication Manager %s", medication.id)
        try:
            if not _medication_active_on(medication, now.date()):
                return
            for reminder in medication.schedule:
                if reminder.enabled:
                    self._schedule_reminder(medication, reminder, now)
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager medication scheduling failed")
            raise MedicationSchedulerError(
                "Не удалось запланировать лекарство"
            ) from err

    def _schedule_reminder(
        self,
        medication: Medication,
        reminder: MedicationReminder,
        now: datetime,
    ) -> None:
        """Schedule one enabled medication reminder."""
        _LOGGER.debug("Scheduling Medication Manager reminder for %s", medication.id)
        try:
            due_at = _next_due_at(reminder.time, now)
            if not _medication_active_on(medication, due_at.date()):
                _LOGGER.debug("Medication Manager course ended before next reminder")
                return
            scheduled = ScheduledMedicationReminder(
                key=_reminder_key(medication.id, reminder.time),
                medication_id=medication.id,
                reminder_time=reminder.time,
                due_at=due_at,
            )

            @callback
            def _async_due(_now: datetime) -> None:
                """Dispatch the scheduled reminder callback."""
                self._unsubs.pop(scheduled.key, None)
                self._hass.async_create_task(self._async_send_reminder(scheduled))

            self._unsubs[scheduled.key] = async_track_point_in_time(
                self._hass,
                _async_due,
                scheduled.due_at,
            )
            _LOGGER.debug(
                "Medication Manager reminder %s scheduled for %s",
                scheduled.key,
                scheduled.due_at,
            )
        except Exception as err:
            _LOGGER.exception("Medication Manager reminder scheduling failed")
            raise MedicationSchedulerError(
                "Не удалось запланировать напоминание"
            ) from err

    async def _async_send_reminder(
        self,
        scheduled: ScheduledMedicationReminder,
    ) -> None:
        """Send one scheduled medication reminder."""
        _LOGGER.debug("Sending scheduled Medication Manager reminder")
        try:
            notify_service = _notify_service_from_entry(self._entry)
            if notify_service is None:
                _LOGGER.debug("Medication Manager notify service is not configured")
                return
            medication = await self._manager.async_get_medication(
                scheduled.medication_id
            )
            if not _reminder_still_enabled(
                medication,
                scheduled.reminder_time,
                scheduled.due_at,
            ):
                _LOGGER.debug("Medication Manager reminder is no longer enabled")
                return

            await self._notifications.async_send_reminder(
                medication,
                notify_service=notify_service,
                scheduled_time=scheduled.due_at,
                snooze_minutes=_snooze_minutes_from_entry(self._entry),
            )
            await self._async_notify_mutation()
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager scheduled reminder failed")
        except Exception:
            _LOGGER.exception("Unexpected Medication Manager scheduled reminder error")
        finally:
            try:
                await self.async_reschedule()
            except HomeAssistantError:
                _LOGGER.exception("Medication Manager post-reminder reschedule failed")
            except Exception:
                _LOGGER.exception("Unexpected post-reminder reschedule error")

    async def _async_notify_mutation(self) -> None:
        """Notify listeners after scheduler-backed state changes."""
        _LOGGER.debug("Publishing Medication Manager scheduler mutation")
        try:
            if self._on_mutation is not None:
                await self._on_mutation()
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager scheduler mutation failed")
            raise MedicationSchedulerError(
                "Не удалось применить изменение планировщика"
            ) from err

    def _cancel_all(self) -> None:
        """Cancel every scheduled reminder callback."""
        _LOGGER.debug("Cancelling all Medication Manager scheduled reminders")
        try:
            for unsub in tuple(self._unsubs.values()):
                unsub()
            self._unsubs.clear()
        except Exception as err:
            _LOGGER.exception("Medication Manager scheduler cancellation failed")
            raise MedicationSchedulerError(
                "Не удалось отменить напоминания"
            ) from err


def _reminder_key(medication_id: UUID, reminder_time: time) -> str:
    """Return a stable key for a medication reminder schedule."""
    _LOGGER.debug("Building Medication Manager reminder key")
    try:
        return f"{medication_id}_{reminder_time.strftime('%H:%M')}"
    except Exception as err:
        _LOGGER.exception("Medication Manager reminder key failed")
        raise MedicationSchedulerError(
            "Не удалось сформировать ключ напоминания"
        ) from err


def _next_due_at(reminder_time: time, now: datetime) -> datetime:
    """Return the next local datetime for a reminder time."""
    _LOGGER.debug("Resolving next Medication Manager reminder datetime")
    try:
        candidate = datetime.combine(now.date(), reminder_time, tzinfo=now.tzinfo)
        if candidate <= now:
            candidate += timedelta(days=1)
        return candidate
    except Exception as err:
        _LOGGER.exception("Medication Manager next reminder datetime failed")
        raise MedicationSchedulerError(
            "Не удалось определить время следующего напоминания"
        ) from err


def _reminder_still_enabled(
    medication: Medication,
    reminder_time: time,
    due_at: datetime,
) -> bool:
    """Return whether a reminder still exists and is enabled."""
    _LOGGER.debug("Checking whether Medication Manager reminder is enabled")
    try:
        return _medication_active_on(medication, due_at.date()) and any(
            reminder.time == reminder_time and reminder.enabled
            for reminder in medication.schedule
        )
    except Exception as err:
        _LOGGER.exception("Medication Manager reminder enabled check failed")
        raise MedicationSchedulerError(
            "Не удалось проверить, включено ли напоминание"
        ) from err


def _medication_active_on(medication: Medication, day: date) -> bool:
    """Return whether a medication should have reminders on a calendar day."""
    try:
        return medication.enabled and (
            medication.course_end_date is None or day <= medication.course_end_date
        )
    except Exception as err:
        _LOGGER.exception("Medication Manager course active check failed")
        raise MedicationSchedulerError(
            "Не удалось проверить срок курса лекарства"
        ) from err


def _notify_service_from_entry(entry: ConfigEntry[object]) -> str | None:
    """Return the configured mobile app notify service."""
    _LOGGER.debug("Reading Medication Manager notify service option")
    try:
        raw_value = entry.options.get(CONF_NOTIFY_SERVICE)
        if raw_value is None:
            raw_value = entry.data.get(CONF_NOTIFY_SERVICE)
        if raw_value is None:
            return None
        if not isinstance(raw_value, str):
            raise MedicationSchedulerError(
                "Сервис уведомлений должен быть строкой"
            )
        normalized = raw_value.strip().removeprefix("notify.")
        if not normalized:
            return None
        if not normalized.startswith("mobile_app_"):
            raise MedicationSchedulerError(
                "Сервис уведомлений должен быть mobile_app"
            )
        return normalized
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager notify service option is invalid")
        raise MedicationSchedulerError(
            "Сервис уведомлений заполнен некорректно"
        ) from err


def _snooze_minutes_from_entry(entry: ConfigEntry[object]) -> int:
    """Return the configured snooze duration."""
    _LOGGER.debug("Reading Medication Manager snooze option")
    try:
        raw_value = entry.options.get(CONF_SNOOZE_MINUTES)
        if raw_value is None:
            raw_value = entry.data.get(CONF_SNOOZE_MINUTES)
        if raw_value is None:
            return DEFAULT_SNOOZE_MINUTES
        minutes = cast(int, raw_value)
        if not isinstance(minutes, int) or isinstance(minutes, bool):
            raise MedicationSchedulerError(
                "Минуты отсрочки должны быть целым числом"
            )
        if minutes < 1 or minutes > 240:
            raise MedicationSchedulerError(
                "Минуты отсрочки должны быть от 1 до 240"
            )
        return minutes
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager snooze option is invalid")
        raise MedicationSchedulerError(
            "Параметр отсрочки заполнен некорректно"
        ) from err
