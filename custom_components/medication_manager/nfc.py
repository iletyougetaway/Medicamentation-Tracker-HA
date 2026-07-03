"""NFC tag handling for Medication Manager."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
import logging
from typing import Any, cast

from homeassistant.components.tag.const import EVENT_TAG_SCANNED, TAG_ID
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import CONF_NOTIFY_SERVICE
from .manager import MedicationManager
from .models import HistorySource, Medication
from .notifications import MedicationNotificationEngine

_LOGGER = logging.getLogger(__name__)


class MedicationNfcError(HomeAssistantError):
    """Raised when Medication Manager NFC handling fails."""


class MedicationNfcEngine:
    """Handle Home Assistant NFC tag scan events for every medication."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry[object],
        manager: MedicationManager,
        notifications: MedicationNotificationEngine,
        on_mutation: Callable[[], Awaitable[None]] | None = None,
    ) -> None:
        """Initialize the NFC engine."""
        _LOGGER.debug("Initializing Medication Manager NFC engine")
        self._hass = hass
        self._entry = entry
        self._manager = manager
        self._notifications = notifications
        self._on_mutation = on_mutation
        self._unsub_tag_scanned: CALLBACK_TYPE | None = None

    async def async_start(self) -> None:
        """Start listening for Home Assistant tag scan events."""
        _LOGGER.debug("Starting Medication Manager NFC engine")
        try:
            if self._unsub_tag_scanned is not None:
                _LOGGER.debug("Medication Manager NFC engine is already running")
                return
            self._unsub_tag_scanned = self._hass.bus.async_listen(
                EVENT_TAG_SCANNED,
                self._async_handle_tag_scanned,
            )
        except Exception as err:
            _LOGGER.exception("Medication Manager NFC engine failed to start")
            raise MedicationNfcError("NFC engine start failed") from err

    async def async_stop(self) -> None:
        """Stop listening for Home Assistant tag scan events."""
        _LOGGER.debug("Stopping Medication Manager NFC engine")
        try:
            if self._unsub_tag_scanned is None:
                return
            self._unsub_tag_scanned()
            self._unsub_tag_scanned = None
        except Exception as err:
            _LOGGER.exception("Medication Manager NFC engine failed to stop")
            raise MedicationNfcError("NFC engine stop failed") from err

    async def _async_handle_tag_scanned(self, event: Event[Any]) -> None:
        """Handle a Home Assistant tag scanned event."""
        _LOGGER.debug("Handling Medication Manager NFC tag event")
        try:
            tag_id = _tag_id_from_event(event)
            medication = await self._manager.async_find_medication_by_tag(tag_id)
            if medication is None:
                _LOGGER.debug(
                    "No Medication Manager medication bound to tag %s",
                    tag_id,
                )
                return
            if not medication.enabled:
                _LOGGER.info(
                    "Ignoring disabled Medication Manager medication %s",
                    medication.id,
                )
                return

            await self._manager.async_take_medication(
                medication.id,
                source=HistorySource.NFC,
            )
            await self._notifications.async_clear_for_medication(medication.id)
            await self._async_send_taken_confirmation(medication)
            await self._async_notify_mutation()
            _LOGGER.info(
                "Recorded Medication Manager NFC intake for medication %s",
                medication.id,
            )
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager NFC tag handling failed")
        except Exception:
            _LOGGER.exception("Unexpected Medication Manager NFC tag handling error")

    async def _async_notify_mutation(self) -> None:
        """Notify listeners after NFC-created state changes."""
        _LOGGER.debug("Publishing Medication Manager NFC mutation")
        try:
            if self._on_mutation is not None:
                await self._on_mutation()
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager NFC mutation publish failed")
            raise MedicationNfcError("NFC mutation publish failed") from err

    async def _async_send_taken_confirmation(self, medication: Medication) -> None:
        """Send an NFC intake confirmation without blocking the intake state update."""
        _LOGGER.debug("Sending Medication Manager NFC intake confirmation")
        try:
            notify_service = _notify_service_from_entry(self._entry)
            if notify_service is None:
                return
            await self._notifications.async_send_taken_confirmation(
                medication,
                notify_service=notify_service,
            )
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager NFC confirmation notification failed")
        except Exception:
            _LOGGER.exception(
                "Unexpected Medication Manager NFC confirmation notification error"
            )


def _tag_id_from_event(event: Event[Any]) -> str:
    """Extract and validate a Home Assistant tag id from an event."""
    _LOGGER.debug("Reading Medication Manager NFC tag id from event")
    try:
        tag_id = cast(str | None, event.data.get(TAG_ID))
        if tag_id is None or not tag_id.strip():
            raise MedicationNfcError("Tag event did not include a tag id")
        return tag_id.strip()
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager NFC tag id is invalid")
        raise MedicationNfcError("NFC tag id is invalid") from err


def _notify_service_from_entry(entry: ConfigEntry[object]) -> str | None:
    """Return the configured mobile app notify service for NFC confirmations."""
    _LOGGER.debug("Reading Medication Manager NFC notify service option")
    try:
        raw_value = entry.options.get(CONF_NOTIFY_SERVICE)
        if raw_value is None:
            raw_value = entry.data.get(CONF_NOTIFY_SERVICE)
        if raw_value is None:
            return None
        if not isinstance(raw_value, str):
            raise MedicationNfcError("Сервис уведомлений должен быть строкой")
        normalized = raw_value.strip().removeprefix("notify.")
        if not normalized:
            return None
        if not normalized.startswith("mobile_app_"):
            raise MedicationNfcError("Сервис уведомлений должен быть mobile_app")
        return normalized
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager NFC notify service option is invalid")
        raise MedicationNfcError(
            "Сервис уведомлений заполнен некорректно"
        ) from err
