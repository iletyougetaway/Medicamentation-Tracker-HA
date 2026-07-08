"""WebSocket API for Medication Manager frontend data."""

from __future__ import annotations

from datetime import date, datetime, timedelta
import logging
from typing import Any, cast

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from .const import DATA_API_REGISTERED, DOMAIN
from .history import MedicationHistory
from .manager import MedicationManager
from .models import (
    HistoryEntry,
    HistoryStatus,
    JsonObject,
    Medication,
    MedicationManagerStoreData,
)
from .runtime import MedicationManagerConfigEntry

_LOGGER = logging.getLogger(__name__)

WS_TYPE_DASHBOARD = f"{DOMAIN}/dashboard"


async def async_setup_api(hass: HomeAssistant) -> None:
    """Register Medication Manager WebSocket API commands."""
    _LOGGER.debug("Registering Medication Manager WebSocket API")
    try:
        domain_data = hass.data.setdefault(DOMAIN, {})
        if domain_data.get(DATA_API_REGISTERED):
            _LOGGER.debug("Medication Manager WebSocket API is already registered")
            return
        websocket_api.async_register_command(hass, _websocket_dashboard)
        domain_data[DATA_API_REGISTERED] = True
    except Exception as err:
        _LOGGER.exception("Medication Manager WebSocket API setup failed")
        raise HomeAssistantError(
            "Не удалось настроить API Менеджера лекарств"
        ) from err


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_DASHBOARD,
        vol.Optional("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def _websocket_dashboard(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return dashboard data for the Medication Manager Lovelace card."""
    _LOGGER.debug("Handling Medication Manager dashboard WebSocket command")
    try:
        entry_id = cast(str | None, msg.get("config_entry_id"))
        entry = _loaded_entry(hass, entry_id)
        result = await _dashboard_payload(
            entry.entry_id,
            entry.runtime_data.manager,
        )
        connection.send_result(msg["id"], result)
    except HomeAssistantError:
        _LOGGER.exception("Medication Manager dashboard API failed")
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected Medication Manager dashboard API error")
        raise HomeAssistantError(
            "Не удалось получить данные карточки Менеджера лекарств"
        ) from err


def _loaded_entry(
    hass: HomeAssistant,
    entry_id: str | None,
) -> MedicationManagerConfigEntry:
    """Return the loaded Medication Manager config entry."""
    _LOGGER.debug("Resolving Medication Manager config entry for API")
    try:
        entries = hass.config_entries.async_entries(DOMAIN)
        if entry_id is not None:
            entries = [entry for entry in entries if entry.entry_id == entry_id]
        loaded = [entry for entry in entries if entry.state is ConfigEntryState.LOADED]
        if not loaded:
            raise HomeAssistantError(
                "Запись интеграции Менеджера лекарств не загружена"
            )
        return cast(MedicationManagerConfigEntry, loaded[0])
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager API config entry resolution failed")
        raise HomeAssistantError(
            "Не удалось найти запись интеграции Менеджера лекарств"
        ) from err


async def _dashboard_payload(
    entry_id: str,
    manager: MedicationManager,
) -> JsonObject:
    """Build the complete dashboard payload for the Lovelace card."""
    _LOGGER.debug("Building Medication Manager dashboard payload")
    try:
        data = await manager.async_get_snapshot()
        now = dt_util.now()
        today = now.date()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)
        return {
            "config_entry_id": entry_id,
            "generated_at": now.isoformat(),
            "medications": [
                _medication_payload(
                    data,
                    medication,
                    now,
                    today,
                    week_start,
                    month_start,
                )
                for medication in sorted(
                    data.medications.values(),
                    key=lambda item: item.name.casefold(),
                )
            ],
        }
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager dashboard payload failed")
        raise HomeAssistantError(
            "Не удалось сформировать данные карточки Менеджера лекарств"
        ) from err


def _medication_payload(
    data: MedicationManagerStoreData,
    medication: Medication,
    now: datetime,
    today: date,
    week_start: date,
    month_start: date,
) -> JsonObject:
    """Build dashboard data for one medication."""
    _LOGGER.debug("Building Medication Manager card payload for %s", medication.id)
    try:
        latest = MedicationHistory.latest_for_medication(data.history, medication.id)
        weekly = MedicationHistory.weekly_summary(
            data.history,
            medication_id=medication.id,
            week_start=week_start,
            today=today,
        )
        monthly = MedicationHistory.monthly_summary(
            data.history,
            medication_id=medication.id,
            month_start=month_start,
            today=today,
        )
        payload = medication.as_storage()
        payload.update(
            {
                "today_status": _today_status(data.history, medication, today, now),
                "next_reminder": _next_reminder(medication, now),
                "last_intake": latest.as_storage() if latest is not None else None,
                "weekly_history": [_day_payload(day) for day in weekly],
                "monthly_history": [_day_payload(day) for day in monthly],
            }
        )
        return payload
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager medication payload failed")
        raise HomeAssistantError("Не удалось сформировать данные лекарства") from err


def _today_status(
    history: tuple[HistoryEntry, ...],
    medication: Medication,
    today: date,
    now: datetime,
) -> str | None:
    """Return today's display status for one medication."""
    _LOGGER.debug("Resolving Medication Manager today status")
    try:
        statuses = tuple(
            entry.status
            for entry in history
            if entry.medication_id == medication.id
            and entry.taken_time.astimezone(now.tzinfo).date() == today
        )
        if HistoryStatus.LATE in statuses:
            return HistoryStatus.LATE.value
        if HistoryStatus.TAKEN in statuses:
            return HistoryStatus.TAKEN.value
        if HistoryStatus.MISSED in statuses:
            return HistoryStatus.MISSED.value
        return None
    except Exception as err:
        _LOGGER.exception("Medication Manager today status failed")
        raise HomeAssistantError("Не удалось определить статус на сегодня") from err


def _next_reminder(medication: Medication, now: datetime) -> JsonObject | None:
    """Return the next enabled reminder for one medication."""
    _LOGGER.debug("Resolving Medication Manager next reminder")
    try:
        enabled = [reminder for reminder in medication.schedule if reminder.enabled]
        if not _medication_active_on(medication, now.date()) or not enabled:
            return None
        sorted_reminders = sorted(enabled, key=lambda reminder: reminder.time)
        for day_offset in (0, 1):
            candidate_day = now.date() + timedelta(days=day_offset)
            for reminder in sorted_reminders:
                due_at = datetime.combine(
                    candidate_day,
                    reminder.time,
                    tzinfo=now.tzinfo,
                )
                if due_at >= now and _medication_active_on(
                    medication,
                    candidate_day,
                ):
                    return {
                        "time": reminder.time.strftime("%H:%M"),
                        "due_at": due_at.isoformat(),
                    }
        return None
    except Exception as err:
        _LOGGER.exception("Medication Manager next reminder failed")
        raise HomeAssistantError(
            "Не удалось определить следующее напоминание"
        ) from err


def _day_payload(day: Any) -> JsonObject:
    """Serialize one day history summary for the dashboard."""
    return {
        "date": day.day.isoformat(),
        "status": day.status.value if day.status else None,
        "entry_ids": [str(entry_id) for entry_id in day.entry_ids],
        "taken_count": day.taken_count,
        "late_count": day.late_count,
        "missed_count": day.missed_count,
        "is_future": day.is_future,
    }


def _medication_active_on(medication: Medication, day: date) -> bool:
    """Return whether a medication is active for a calendar day."""
    return medication.enabled and (
        medication.course_end_date is None or day <= medication.course_end_date
    )
