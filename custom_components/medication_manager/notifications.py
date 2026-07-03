"""Notification engine for Medication Manager."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime, timezone
import logging
from typing import Any, Awaitable, Callable, cast
from uuid import UUID

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_call_later

from .const import (
    DOMAIN,
    EVENT_REMIND_LATER,
    SETTINGS_ACTIVE_NOTIFICATIONS,
)
from .manager import MedicationManager, MedicationManagerError
from .models import (
    HistorySource,
    JsonObject,
    JsonValue,
    Medication,
)

_LOGGER = logging.getLogger(__name__)

EVENT_MOBILE_APP_NOTIFICATION_ACTION = "mobile_app_notification_action"
NOTIFY_DOMAIN = "notify"

ACTION_TAKE = "take"
ACTION_REMIND_LATER = "remind_later"
DEFAULT_SNOOZE_MINUTES = 10
MAX_SNOOZE_MINUTES = 240


class MedicationNotificationError(HomeAssistantError):
    """Raised when Medication Manager notification handling fails."""


@dataclass(frozen=True, slots=True)
class MedicationNotification:
    """Active notification metadata stored by Medication Manager."""

    medication_id: UUID
    notify_service: str
    tag: str
    scheduled_time: datetime | None
    created_at: datetime
    title: str | None
    message: str | None
    snooze_minutes: int

    @classmethod
    def from_storage(cls, value: object) -> MedicationNotification:
        """Create notification metadata from storage."""
        _LOGGER.debug("Parsing Medication Manager notification metadata")
        try:
            if not isinstance(value, Mapping):
                raise MedicationNotificationError("notification must be an object")
            data = cast(Mapping[str, object], value)
            return cls(
                medication_id=UUID(_required_str(data, "medication_id")),
                notify_service=_required_str(data, "notify_service"),
                tag=_required_str(data, "tag"),
                scheduled_time=_optional_datetime(data.get("scheduled_time")),
                created_at=_parse_datetime(_required_str(data, "created_at")),
                title=_optional_str(data.get("title")),
                message=_optional_str(data.get("message")),
                snooze_minutes=_optional_int(
                    data.get("snooze_minutes"),
                    DEFAULT_SNOOZE_MINUTES,
                ),
            )
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager notification metadata is invalid")
            raise MedicationNotificationError(
                "Notification metadata is invalid"
            ) from err

    def as_storage(self) -> JsonObject:
        """Serialize notification metadata to storage."""
        _LOGGER.debug(
            "Serializing Medication Manager notification metadata for %s",
            self.medication_id,
        )
        try:
            return {
                "medication_id": str(self.medication_id),
                "notify_service": self.notify_service,
                "tag": self.tag,
                "scheduled_time": (
                    _format_datetime(self.scheduled_time)
                    if self.scheduled_time is not None
                    else None
                ),
                "created_at": _format_datetime(self.created_at),
                "title": self.title,
                "message": self.message,
                "snooze_minutes": self.snooze_minutes,
            }
        except Exception as err:
            _LOGGER.exception("Medication Manager notification serialization failed")
            raise MedicationNotificationError(
                "Notification serialization failed"
            ) from err


class MedicationNotificationEngine:
    """Send and handle Medication Manager mobile app notifications."""

    def __init__(
        self,
        hass: HomeAssistant,
        manager: MedicationManager,
        on_mutation: Callable[[], Awaitable[None]] | None = None,
    ) -> None:
        """Initialize the notification engine."""
        _LOGGER.debug("Initializing Medication Manager notification engine")
        self._hass = hass
        self._manager = manager
        self._on_mutation = on_mutation
        self._unsub_action: CALLBACK_TYPE | None = None
        self._snooze_unsubs: dict[str, CALLBACK_TYPE] = {}
        self._snooze_records: dict[str, MedicationNotification] = {}

    async def async_start(self) -> None:
        """Start listening for mobile app notification actions."""
        _LOGGER.debug("Starting Medication Manager notification engine")
        try:
            if self._unsub_action is not None:
                _LOGGER.debug("Medication Manager notification engine is running")
                return
            self._unsub_action = self._hass.bus.async_listen(
                EVENT_MOBILE_APP_NOTIFICATION_ACTION,
                self._async_handle_action_event,
            )
        except Exception as err:
            _LOGGER.exception("Medication Manager notification engine failed to start")
            raise MedicationNotificationError(
                "Notification engine start failed"
            ) from err

    async def async_stop(self) -> None:
        """Stop listening for mobile app notification actions."""
        _LOGGER.debug("Stopping Medication Manager notification engine")
        try:
            if self._unsub_action is None:
                return
            self._unsub_action()
            self._unsub_action = None
            self._cancel_all_snoozes()
        except Exception as err:
            _LOGGER.exception("Medication Manager notification engine failed to stop")
            raise MedicationNotificationError(
                "Notification engine stop failed"
            ) from err

    async def async_send_reminder(
        self,
        medication: Medication,
        *,
        notify_service: str,
        scheduled_time: datetime | None = None,
        title: str | None = None,
        message: str | None = None,
        snooze_minutes: int = DEFAULT_SNOOZE_MINUTES,
    ) -> MedicationNotification:
        """Send a medication reminder notification."""
        _LOGGER.debug(
            "Sending Medication Manager reminder for medication %s",
            medication.id,
        )
        try:
            normalized_service = _normalize_notify_service(notify_service)
            normalized_scheduled_time = _normalize_optional_datetime(scheduled_time)
            normalized_title = _normalize_optional_text(title)
            normalized_message = _normalize_optional_text(message)
            normalized_snooze_minutes = _normalize_snooze_minutes(snooze_minutes)
            tag = _notification_tag(medication.id, normalized_scheduled_time)
            self._cancel_snooze(tag)
            notification = MedicationNotification(
                medication_id=medication.id,
                notify_service=normalized_service,
                tag=tag,
                scheduled_time=normalized_scheduled_time,
                created_at=datetime.now(timezone.utc),
                title=normalized_title,
                message=normalized_message,
                snooze_minutes=normalized_snooze_minutes,
            )
            await self._hass.services.async_call(
                NOTIFY_DOMAIN,
                normalized_service,
                {
                    "title": (
                        normalized_title
                        or f"Medication reminder: {medication.name}"
                    ),
                    "message": normalized_message or f"Time to take {medication.name}.",
                    "data": _notification_data(notification),
                },
                blocking=True,
            )
            await self._store_active_notification(notification)
            await self._async_notify_mutation()
            _LOGGER.info(
                "Sent Medication Manager reminder for medication %s",
                medication.id,
            )
            return notification
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager reminder notification failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager notification error")
            raise MedicationNotificationError(
                "Reminder notification failed"
            ) from err

    async def async_clear_for_medication(self, medication_id: UUID) -> None:
        """Clear active notifications for a medication."""
        _LOGGER.debug(
            "Clearing Medication Manager notifications for medication %s",
            medication_id,
        )
        try:
            self._cancel_snoozes_for_medication(medication_id)
            active = await self._active_notifications()
            remaining: dict[str, MedicationNotification] = {}
            for tag, notification in active.items():
                if notification.medication_id == medication_id:
                    await self._clear_notification(notification)
                    continue
                remaining[tag] = notification
            await self._replace_active_notifications(remaining)
            await self._async_notify_mutation()
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager notification clear failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager notification clear error")
            raise MedicationNotificationError(
                "Notification clear failed"
            ) from err

    async def async_clear_all(self) -> None:
        """Clear every active Medication Manager notification."""
        _LOGGER.debug("Clearing all Medication Manager notifications")
        try:
            self._cancel_all_snoozes()
            active = await self._active_notifications()
            for notification in active.values():
                await self._clear_notification(notification)
            await self._replace_active_notifications({})
            await self._async_notify_mutation()
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager notification clear all failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected clear all notification error")
            raise MedicationNotificationError(
                "Notification clear all failed"
            ) from err

    async def _async_handle_action_event(self, event: Event[Any]) -> None:
        """Handle mobile app notification action events."""
        _LOGGER.debug("Handling Medication Manager notification action event")
        try:
            action = cast(str | None, event.data.get("action"))
            if action is None:
                return
            active = await self._active_notifications()
            notification = _notification_for_action(action, active)
            if notification is None:
                return
            if action == _action_name(ACTION_TAKE, notification.tag):
                await self._handle_take_action(notification)
            elif action == _action_name(ACTION_REMIND_LATER, notification.tag):
                await self._handle_remind_later_action(notification)
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager notification action failed")
        except Exception:
            _LOGGER.exception("Unexpected Medication Manager notification action error")

    async def _handle_take_action(self, notification: MedicationNotification) -> None:
        """Handle a notification Take action."""
        _LOGGER.debug(
            "Handling Medication Manager Take action for %s",
            notification.medication_id,
        )
        try:
            await self._manager.async_take_medication(
                notification.medication_id,
                scheduled_time=notification.scheduled_time,
                source=HistorySource.NOTIFICATION,
            )
            await self.async_clear_for_medication(notification.medication_id)
            await self._async_notify_mutation()
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager Take action failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager Take action error")
            raise MedicationNotificationError("Take action failed") from err

    async def _handle_remind_later_action(
        self,
        notification: MedicationNotification,
    ) -> None:
        """Handle a notification Remind Later action."""
        _LOGGER.debug(
            "Handling Medication Manager Remind Later action for %s",
            notification.medication_id,
        )
        try:
            await self._clear_notification(notification)
            active = await self._active_notifications()
            active.pop(notification.tag, None)
            await self._replace_active_notifications(active)
            self._schedule_snooze(notification)
            self._hass.bus.async_fire(
                EVENT_REMIND_LATER,
                {
                    "medication_id": str(notification.medication_id),
                    "scheduled_time": (
                        _format_datetime(notification.scheduled_time)
                        if notification.scheduled_time is not None
                        else None
                    ),
                    "snooze_minutes": notification.snooze_minutes,
                },
            )
            await self._async_notify_mutation()
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager Remind Later action failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager Remind Later error")
            raise MedicationNotificationError("Remind Later action failed") from err

    async def _clear_notification(
        self,
        notification: MedicationNotification,
    ) -> None:
        """Dismiss one active mobile app notification by tag."""
        _LOGGER.debug("Clearing Medication Manager notification %s", notification.tag)
        try:
            await self._hass.services.async_call(
                NOTIFY_DOMAIN,
                notification.notify_service,
                {
                    "message": "clear_notification",
                    "data": {"tag": notification.tag},
                },
                blocking=True,
            )
        except Exception as err:
            _LOGGER.exception("Medication Manager notification dismiss failed")
            raise MedicationNotificationError(
                "Notification dismiss failed"
            ) from err

    async def _store_active_notification(
        self,
        notification: MedicationNotification,
    ) -> None:
        """Persist one active notification."""
        _LOGGER.debug("Storing active Medication Manager notification")
        try:
            active = await self._active_notifications()
            active[notification.tag] = notification
            await self._replace_active_notifications(active)
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Unable to store Medication Manager notification")
            raise MedicationNotificationError(
                "Notification storage failed"
            ) from err

    async def _active_notifications(self) -> dict[str, MedicationNotification]:
        """Read active notification metadata from settings."""
        _LOGGER.debug("Reading active Medication Manager notifications")
        try:
            settings = await self._manager.async_get_settings()
            raw_notifications = settings.get(SETTINGS_ACTIVE_NOTIFICATIONS, {})
            if not isinstance(raw_notifications, Mapping):
                return {}
            return {
                str(tag): MedicationNotification.from_storage(payload)
                for tag, payload in raw_notifications.items()
            }
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Unable to read Medication Manager notifications")
            raise MedicationNotificationError(
                "Notification settings read failed"
            ) from err

    async def _replace_active_notifications(
        self,
        notifications: Mapping[str, MedicationNotification],
    ) -> None:
        """Replace active notification metadata in settings."""
        _LOGGER.debug("Replacing active Medication Manager notifications")
        try:
            payload: dict[str, JsonValue] = {
                tag: notification.as_storage()
                for tag, notification in notifications.items()
            }
            await self._manager.async_update_settings(
                {SETTINGS_ACTIVE_NOTIFICATIONS: payload}
            )
        except MedicationManagerError:
            raise
        except Exception as err:
            _LOGGER.exception("Unable to replace Medication Manager notifications")
            raise MedicationNotificationError(
                "Notification settings update failed"
            ) from err

    async def _async_notify_mutation(self) -> None:
        """Notify listeners that notification-backed state changed."""
        _LOGGER.debug("Publishing Medication Manager notification mutation")
        try:
            if self._on_mutation is not None:
                await self._on_mutation()
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager notification mutation failed")
            raise MedicationNotificationError(
                "Notification mutation publish failed"
            ) from err

    def _schedule_snooze(self, notification: MedicationNotification) -> None:
        """Schedule a snoozed reminder notification."""
        _LOGGER.debug("Scheduling Medication Manager snooze for %s", notification.tag)
        try:
            self._cancel_snooze(notification.tag)
            self._snooze_records[notification.tag] = notification

            @callback
            def _async_send_snoozed(_now: datetime) -> None:
                """Dispatch the snoozed notification callback."""
                self._snooze_unsubs.pop(notification.tag, None)
                self._snooze_records.pop(notification.tag, None)
                self._hass.async_create_task(
                    self._async_send_snoozed_notification(notification)
                )

            self._snooze_unsubs[notification.tag] = async_call_later(
                self._hass,
                notification.snooze_minutes * 60,
                _async_send_snoozed,
            )
        except Exception as err:
            _LOGGER.exception("Medication Manager snooze scheduling failed")
            raise MedicationNotificationError("Snooze scheduling failed") from err

    async def _async_send_snoozed_notification(
        self,
        notification: MedicationNotification,
    ) -> None:
        """Send a previously snoozed medication reminder."""
        _LOGGER.debug(
            "Sending snoozed Medication Manager notification %s",
            notification.tag,
        )
        try:
            medication = await self._manager.async_get_medication(
                notification.medication_id
            )
            await self.async_send_reminder(
                medication,
                notify_service=notification.notify_service,
                scheduled_time=notification.scheduled_time,
                title=notification.title,
                message=notification.message,
                snooze_minutes=notification.snooze_minutes,
            )
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager snoozed notification failed")
        except Exception:
            _LOGGER.exception("Unexpected Medication Manager snoozed notification")

    def _cancel_snoozes_for_medication(self, medication_id: UUID) -> None:
        """Cancel pending snoozed reminders for a medication."""
        _LOGGER.debug("Cancelling Medication Manager snoozes for %s", medication_id)
        try:
            for tag, notification in tuple(self._snooze_records.items()):
                if notification.medication_id == medication_id:
                    self._cancel_snooze(tag)
        except Exception as err:
            _LOGGER.exception("Medication Manager snooze cancellation failed")
            raise MedicationNotificationError("Snooze cancellation failed") from err

    def _cancel_all_snoozes(self) -> None:
        """Cancel every pending snoozed reminder."""
        _LOGGER.debug("Cancelling all Medication Manager snoozes")
        try:
            for tag in tuple(self._snooze_unsubs):
                self._cancel_snooze(tag)
        except Exception as err:
            _LOGGER.exception("Medication Manager snooze clear failed")
            raise MedicationNotificationError("Snooze clear failed") from err

    def _cancel_snooze(self, tag: str) -> None:
        """Cancel one pending snoozed reminder."""
        _LOGGER.debug("Cancelling Medication Manager snooze %s", tag)
        try:
            unsub = self._snooze_unsubs.pop(tag, None)
            if unsub is not None:
                unsub()
            self._snooze_records.pop(tag, None)
        except Exception as err:
            _LOGGER.exception("Medication Manager snooze cancel failed")
            raise MedicationNotificationError("Snooze cancel failed") from err


def _notification_data(notification: MedicationNotification) -> JsonObject:
    """Build mobile app notification data."""
    _LOGGER.debug("Building Medication Manager mobile app notification data")
    try:
        return {
            "tag": notification.tag,
            "actions": [
                {
                    "action": _action_name(ACTION_TAKE, notification.tag),
                    "title": "Take",
                    "action_data": {"tag": notification.tag},
                },
                {
                    "action": _action_name(ACTION_REMIND_LATER, notification.tag),
                    "title": "Remind Later",
                    "action_data": {"tag": notification.tag},
                },
            ],
        }
    except Exception as err:
        _LOGGER.exception("Medication Manager notification data build failed")
        raise MedicationNotificationError("Notification data build failed") from err


def _action_name(action: str, tag: str) -> str:
    """Return a unique mobile app notification action name."""
    _LOGGER.debug("Building Medication Manager notification action name")
    try:
        return f"{DOMAIN}_{action}_{tag}"
    except Exception as err:
        _LOGGER.exception("Medication Manager action name build failed")
        raise MedicationNotificationError("Notification action name failed") from err


def _notification_for_action(
    action: str,
    active: Mapping[str, MedicationNotification],
) -> MedicationNotification | None:
    """Resolve an active notification from a mobile app action id."""
    _LOGGER.debug("Resolving Medication Manager notification action")
    try:
        for notification in active.values():
            if action in (
                _action_name(ACTION_TAKE, notification.tag),
                _action_name(ACTION_REMIND_LATER, notification.tag),
            ):
                return notification
        return None
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager notification action resolution failed")
        raise MedicationNotificationError("Notification action is invalid") from err


def _notification_tag(
    medication_id: UUID,
    scheduled_time: datetime | None,
) -> str:
    """Return a stable notification tag for a medication reminder."""
    _LOGGER.debug("Building Medication Manager notification tag")
    try:
        if scheduled_time is None:
            return f"{DOMAIN}_{medication_id}"
        return f"{DOMAIN}_{medication_id}_{int(scheduled_time.timestamp())}"
    except Exception as err:
        _LOGGER.exception("Medication Manager notification tag build failed")
        raise MedicationNotificationError("Notification tag build failed") from err


def _normalize_notify_service(value: str) -> str:
    """Normalize a Home Assistant notify service name."""
    _LOGGER.debug("Normalizing Medication Manager notify service")
    try:
        normalized = value.strip()
        if not normalized:
            raise MedicationNotificationError("notify service must not be empty")
        normalized = normalized.removeprefix("notify.")
        if not normalized.startswith("mobile_app_"):
            raise MedicationNotificationError("notify service must be mobile_app")
        return normalized
    except Exception as err:
        _LOGGER.exception("Medication Manager notify service is invalid")
        raise MedicationNotificationError("Notify service is invalid") from err


def _normalize_optional_text(value: str | None) -> str | None:
    """Normalize optional notification text."""
    _LOGGER.debug("Normalizing Medication Manager notification text")
    try:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None
    except Exception as err:
        _LOGGER.exception("Medication Manager notification text is invalid")
        raise MedicationNotificationError("Notification text is invalid") from err


def _normalize_snooze_minutes(value: int) -> int:
    """Normalize notification snooze minutes."""
    _LOGGER.debug("Normalizing Medication Manager snooze minutes")
    try:
        if value < 1 or value > MAX_SNOOZE_MINUTES:
            raise MedicationNotificationError("snooze minutes is out of range")
        return value
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager snooze minutes is invalid")
        raise MedicationNotificationError("Snooze minutes is invalid") from err


def _required_str(data: Mapping[str, object], key: str) -> str:
    """Read a required string from storage."""
    _LOGGER.debug("Reading Medication Manager notification string %s", key)
    try:
        value = data[key]
        if not isinstance(value, str):
            raise MedicationNotificationError(f"{key} must be a string")
        return value
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager notification string is invalid")
        raise MedicationNotificationError(f"{key} is invalid") from err


def _optional_str(value: object) -> str | None:
    """Read an optional notification string from storage."""
    _LOGGER.debug("Reading optional Medication Manager notification string")
    try:
        if value is None:
            return None
        if not isinstance(value, str):
            raise MedicationNotificationError("value must be a string")
        return value
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager optional string is invalid")
        raise MedicationNotificationError("optional string is invalid") from err


def _optional_int(value: object, default: int) -> int:
    """Read an optional notification integer from storage."""
    _LOGGER.debug("Reading optional Medication Manager notification integer")
    try:
        if value is None:
            return default
        if not isinstance(value, int) or isinstance(value, bool):
            raise MedicationNotificationError("value must be an integer")
        return _normalize_snooze_minutes(value)
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager optional integer is invalid")
        raise MedicationNotificationError("optional integer is invalid") from err


def _optional_datetime(value: object) -> datetime | None:
    """Parse an optional notification datetime."""
    _LOGGER.debug("Parsing optional Medication Manager notification datetime")
    try:
        if value is None:
            return None
        if not isinstance(value, str):
            raise MedicationNotificationError("datetime must be a string")
        return _parse_datetime(value)
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Optional Medication Manager datetime is invalid")
        raise MedicationNotificationError("datetime is invalid") from err


def _normalize_optional_datetime(value: datetime | None) -> datetime | None:
    """Normalize an optional aware datetime to UTC."""
    _LOGGER.debug("Normalizing Medication Manager notification datetime")
    try:
        if value is None:
            return None
        if value.tzinfo is None:
            raise MedicationNotificationError("datetime must include timezone")
        return value.astimezone(timezone.utc)
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager notification datetime is invalid")
        raise MedicationNotificationError("datetime is invalid") from err


def _parse_datetime(value: str) -> datetime:
    """Parse an aware notification datetime."""
    _LOGGER.debug("Parsing Medication Manager notification datetime")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            raise MedicationNotificationError("datetime must include timezone")
        return parsed.astimezone(timezone.utc)
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager notification datetime parse failed")
        raise MedicationNotificationError("datetime is invalid") from err


def _format_datetime(value: datetime) -> str:
    """Format an aware notification datetime."""
    _LOGGER.debug("Formatting Medication Manager notification datetime")
    try:
        if value.tzinfo is None:
            raise MedicationNotificationError("datetime must include timezone")
        return value.astimezone(timezone.utc).isoformat()
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager notification datetime format failed")
        raise MedicationNotificationError("datetime formatting failed") from err
