"""Service actions for Medication Manager."""

from __future__ import annotations

from collections.abc import Mapping
from datetime import datetime, time
import logging
from typing import TYPE_CHECKING, Any, cast
from uuid import UUID

import voluptuous as vol

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
)
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
import homeassistant.helpers.config_validation as cv

from .const import (
    ATTR_CONFIG_ENTRY_ID,
    ATTR_ENABLED,
    ATTR_ICON,
    ATTR_MEDICATION_ID,
    ATTR_MESSAGE,
    ATTR_NAME,
    ATTR_NOTIFY_SERVICE,
    ATTR_REMINDERS,
    ATTR_SCHEDULED_TIME,
    ATTR_SNOOZE_MINUTES,
    ATTR_SOURCE,
    ATTR_STATUS,
    ATTR_TAG_ID,
    ATTR_TAKEN_TIME,
    ATTR_TIME,
    ATTR_TITLE,
    DATA_SERVICES_REGISTERED,
    DEFAULT_MEDICATION_ICON,
    DOMAIN,
    SERVICE_ADD_MEDICATION,
    SERVICE_BIND_TAG,
    SERVICE_DELETE_MEDICATION,
    SERVICE_SEND_REMINDER,
    SERVICE_TAKE_MEDICATION,
    SERVICE_UPDATE_MEDICATION,
)
from .manager import MedicationManagerError
from .models import HistoryEntry, HistorySource, HistoryStatus, Medication
from .models import MedicationReminder

if TYPE_CHECKING:
    from .runtime import MedicationManagerRuntimeData

_LOGGER = logging.getLogger(__name__)


async def async_setup_services(hass: HomeAssistant) -> None:
    """Register Medication Manager service actions."""
    _LOGGER.debug("Registering Medication Manager service actions")
    try:
        domain_data = hass.data.setdefault(DOMAIN, {})
        if domain_data.get(DATA_SERVICES_REGISTERED):
            _LOGGER.debug("Medication Manager service actions are already registered")
            return

        hass.services.async_register(
            DOMAIN,
            SERVICE_ADD_MEDICATION,
            _async_add_medication,
            schema=ADD_MEDICATION_SCHEMA,
            supports_response=SupportsResponse.OPTIONAL,
        )
        hass.services.async_register(
            DOMAIN,
            SERVICE_UPDATE_MEDICATION,
            _async_update_medication,
            schema=UPDATE_MEDICATION_SCHEMA,
            supports_response=SupportsResponse.OPTIONAL,
        )
        hass.services.async_register(
            DOMAIN,
            SERVICE_DELETE_MEDICATION,
            _async_delete_medication,
            schema=DELETE_MEDICATION_SCHEMA,
            supports_response=SupportsResponse.OPTIONAL,
        )
        hass.services.async_register(
            DOMAIN,
            SERVICE_BIND_TAG,
            _async_bind_tag,
            schema=BIND_TAG_SCHEMA,
            supports_response=SupportsResponse.OPTIONAL,
        )
        hass.services.async_register(
            DOMAIN,
            SERVICE_TAKE_MEDICATION,
            _async_take_medication,
            schema=TAKE_MEDICATION_SCHEMA,
            supports_response=SupportsResponse.OPTIONAL,
        )
        hass.services.async_register(
            DOMAIN,
            SERVICE_SEND_REMINDER,
            _async_send_reminder,
            schema=SEND_REMINDER_SCHEMA,
            supports_response=SupportsResponse.OPTIONAL,
        )
        domain_data[DATA_SERVICES_REGISTERED] = True
        _LOGGER.info("Medication Manager service actions registered")
    except Exception as err:
        _LOGGER.exception("Unable to register Medication Manager service actions")
        raise HomeAssistantError(
            "Medication Manager service registration failed"
        ) from err


async def _async_add_medication(call: ServiceCall) -> ServiceResponse:
    """Handle the add medication service action."""
    _LOGGER.debug("Handling Medication Manager add_medication service action")
    try:
        runtime_data = _runtime_from_call(call)
        medication = await runtime_data.manager.async_add_medication(
            name=cast(str, call.data[ATTR_NAME]),
            icon=cast(str, call.data[ATTR_ICON]),
            tag_id=cast(str | None, call.data.get(ATTR_TAG_ID)),
            enabled=cast(bool, call.data[ATTR_ENABLED]),
            reminders=_reminders_from_call(call.data),
        )
        await runtime_data.coordinator.async_refresh_after_mutation()
        return _medication_response(medication)
    except MedicationManagerError as err:
        _LOGGER.warning("Medication Manager add_medication rejected: %s", err)
        raise ServiceValidationError(str(err)) from err
    except HomeAssistantError:
        _LOGGER.exception("Medication Manager add_medication failed")
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected Medication Manager add_medication failure")
        raise HomeAssistantError("Medication Manager add_medication failed") from err


async def _async_update_medication(call: ServiceCall) -> ServiceResponse:
    """Handle the update medication service action."""
    _LOGGER.debug("Handling Medication Manager update_medication service action")
    try:
        runtime_data = _runtime_from_call(call)
        medication = await runtime_data.manager.async_update_medication(
            cast(str, call.data[ATTR_MEDICATION_ID]),
            name=cast(str | None, call.data.get(ATTR_NAME)),
            icon=cast(str | None, call.data.get(ATTR_ICON)),
            tag_id=cast(str | None, call.data.get(ATTR_TAG_ID)),
            clear_tag=cast(bool, call.data["clear_tag"]),
            enabled=cast(bool | None, call.data.get(ATTR_ENABLED)),
            reminders=_optional_reminders_from_call(call.data),
        )
        await runtime_data.coordinator.async_refresh_after_mutation()
        return _medication_response(medication)
    except MedicationManagerError as err:
        _LOGGER.warning("Medication Manager update_medication rejected: %s", err)
        raise ServiceValidationError(str(err)) from err
    except HomeAssistantError:
        _LOGGER.exception("Medication Manager update_medication failed")
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected Medication Manager update_medication failure")
        raise HomeAssistantError("Medication Manager update_medication failed") from err


async def _async_delete_medication(call: ServiceCall) -> ServiceResponse:
    """Handle the delete medication service action."""
    _LOGGER.debug("Handling Medication Manager delete_medication service action")
    try:
        runtime_data = _runtime_from_call(call)
        medication = await runtime_data.manager.async_delete_medication(
            cast(str, call.data[ATTR_MEDICATION_ID]),
        )
        await runtime_data.coordinator.async_refresh_after_mutation()
        return {"deleted": True, "medication": medication.as_storage()}
    except MedicationManagerError as err:
        _LOGGER.warning("Medication Manager delete_medication rejected: %s", err)
        raise ServiceValidationError(str(err)) from err
    except HomeAssistantError:
        _LOGGER.exception("Medication Manager delete_medication failed")
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected Medication Manager delete_medication failure")
        raise HomeAssistantError("Medication Manager delete_medication failed") from err


async def _async_bind_tag(call: ServiceCall) -> ServiceResponse:
    """Handle the bind tag service action."""
    _LOGGER.debug("Handling Medication Manager bind_tag service action")
    try:
        runtime_data = _runtime_from_call(call)
        medication = await runtime_data.manager.async_bind_tag(
            cast(str, call.data[ATTR_MEDICATION_ID]),
            tag_id=cast(str, call.data[ATTR_TAG_ID]),
        )
        await runtime_data.coordinator.async_refresh_after_mutation()
        return _medication_response(medication)
    except MedicationManagerError as err:
        _LOGGER.warning("Medication Manager bind_tag rejected: %s", err)
        raise ServiceValidationError(str(err)) from err
    except HomeAssistantError:
        _LOGGER.exception("Medication Manager bind_tag failed")
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected Medication Manager bind_tag failure")
        raise HomeAssistantError("Medication Manager bind_tag failed") from err


async def _async_take_medication(call: ServiceCall) -> ServiceResponse:
    """Handle the take medication service action."""
    _LOGGER.debug("Handling Medication Manager take_medication service action")
    try:
        runtime_data = _runtime_from_call(call)
        medication_id = cast(str, call.data[ATTR_MEDICATION_ID])
        entry = await runtime_data.manager.async_take_medication(
            medication_id,
            scheduled_time=cast(datetime | None, call.data.get(ATTR_SCHEDULED_TIME)),
            taken_time=cast(datetime | None, call.data.get(ATTR_TAKEN_TIME)),
            source=cast(HistorySource | str, call.data[ATTR_SOURCE]),
            status=cast(HistoryStatus | str | None, call.data.get(ATTR_STATUS)),
        )
        await runtime_data.notifications.async_clear_for_medication(
            entry.medication_id
        )
        medication = await runtime_data.manager.async_get_medication(medication_id)
        await runtime_data.coordinator.async_refresh_after_mutation()
        return _history_response(entry, medication)
    except MedicationManagerError as err:
        _LOGGER.warning("Medication Manager take_medication rejected: %s", err)
        raise ServiceValidationError(str(err)) from err
    except HomeAssistantError:
        _LOGGER.exception("Medication Manager take_medication failed")
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected Medication Manager take_medication failure")
        raise HomeAssistantError("Medication Manager take_medication failed") from err


async def _async_send_reminder(call: ServiceCall) -> ServiceResponse:
    """Handle the send reminder service action."""
    _LOGGER.debug("Handling Medication Manager send_reminder service action")
    try:
        runtime_data = _runtime_from_call(call)
        medication = await runtime_data.manager.async_get_medication(
            cast(str, call.data[ATTR_MEDICATION_ID])
        )
        notification = await runtime_data.notifications.async_send_reminder(
            medication,
            notify_service=cast(str, call.data[ATTR_NOTIFY_SERVICE]),
            scheduled_time=cast(datetime | None, call.data.get(ATTR_SCHEDULED_TIME)),
            title=cast(str | None, call.data.get(ATTR_TITLE)),
            message=cast(str | None, call.data.get(ATTR_MESSAGE)),
            snooze_minutes=cast(int, call.data[ATTR_SNOOZE_MINUTES]),
        )
        await runtime_data.coordinator.async_refresh_after_mutation()
        return {
            "notification": notification.as_storage(),
            "medication": medication.as_storage(),
        }
    except MedicationManagerError as err:
        _LOGGER.warning("Medication Manager send_reminder rejected: %s", err)
        raise ServiceValidationError(str(err)) from err
    except HomeAssistantError:
        _LOGGER.exception("Medication Manager send_reminder failed")
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected Medication Manager send_reminder failure")
        raise HomeAssistantError("Medication Manager send_reminder failed") from err


def _runtime_from_call(call: ServiceCall) -> MedicationManagerRuntimeData:
    """Resolve runtime data for the service action config entry."""
    _LOGGER.debug("Resolving Medication Manager runtime data for service action")
    try:
        config_entry_id = cast(str, call.data[ATTR_CONFIG_ENTRY_ID])
        entry = call.hass.config_entries.async_get_entry(config_entry_id)
        if entry is None or entry.domain != DOMAIN:
            raise ServiceValidationError(
                "Medication Manager config entry was not found"
            )
        if entry.state is not ConfigEntryState.LOADED:
            raise ServiceValidationError(
                "Medication Manager config entry is not loaded"
            )

        runtime_data = getattr(entry, "runtime_data", None)
        if runtime_data is None:
            raise ServiceValidationError("Medication Manager runtime data is missing")
        return cast("MedicationManagerRuntimeData", runtime_data)
    except ServiceValidationError:
        raise
    except Exception as err:
        _LOGGER.exception("Unable to resolve Medication Manager runtime data")
        raise HomeAssistantError(
            "Medication Manager runtime resolution failed"
        ) from err


def _reminders_from_call(data: Mapping[str, Any]) -> tuple[MedicationReminder, ...]:
    """Read required reminders from service action data."""
    _LOGGER.debug("Reading Medication Manager reminders from service action")
    try:
        return _parse_reminders(cast(list[Mapping[str, Any]], data[ATTR_REMINDERS]))
    except Exception as err:
        _LOGGER.exception("Unable to read Medication Manager reminders")
        raise ServiceValidationError("Reminder data is invalid") from err


def _optional_reminders_from_call(
    data: Mapping[str, Any],
) -> tuple[MedicationReminder, ...] | None:
    """Read optional reminders from service action data."""
    _LOGGER.debug("Reading optional Medication Manager reminders from service action")
    try:
        if ATTR_REMINDERS not in data:
            return None
        return _parse_reminders(cast(list[Mapping[str, Any]], data[ATTR_REMINDERS]))
    except Exception as err:
        _LOGGER.exception("Unable to read optional Medication Manager reminders")
        raise ServiceValidationError("Reminder data is invalid") from err


def _parse_reminders(
    reminders: list[Mapping[str, Any]],
) -> tuple[MedicationReminder, ...]:
    """Parse service action reminder objects into model instances."""
    _LOGGER.debug("Parsing Medication Manager reminders from service action")
    try:
        return tuple(
            MedicationReminder(
                time=cast(time, reminder[ATTR_TIME]),
                enabled=cast(bool, reminder[ATTR_ENABLED]),
            )
            for reminder in reminders
        )
    except Exception as err:
        _LOGGER.exception("Medication Manager reminder parsing failed")
        raise ServiceValidationError("Reminder data is invalid") from err


def _medication_response(medication: Medication) -> ServiceResponse:
    """Build a service action response payload for a medication."""
    _LOGGER.debug("Building Medication Manager service response for %s", medication.id)
    try:
        return {"medication": medication.as_storage()}
    except Exception as err:
        _LOGGER.exception("Medication Manager service response failed")
        raise HomeAssistantError("Medication Manager response creation failed") from err


def _history_response(
    entry: HistoryEntry,
    medication: Medication,
) -> ServiceResponse:
    """Build a service action response payload for a history entry."""
    _LOGGER.debug("Building Medication Manager history response for %s", entry.id)
    try:
        return {
            "history_entry": entry.as_storage(),
            "medication": medication.as_storage(),
        }
    except Exception as err:
        _LOGGER.exception("Medication Manager history response failed")
        raise HomeAssistantError("Medication Manager response creation failed") from err


def _ensure_list(value: object) -> list[object]:
    """Validate a service action value as a list."""
    _LOGGER.debug("Validating Medication Manager service list value")
    try:
        if not isinstance(value, list):
            raise vol.Invalid("expected a list")
        return value
    except vol.Invalid:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager service list validation failed")
        raise vol.Invalid("expected a list") from err


def _validate_uuid_string(value: object) -> str:
    """Validate a service action value as a UUID string."""
    _LOGGER.debug("Validating Medication Manager UUID service value")
    try:
        if not isinstance(value, str):
            raise vol.Invalid("expected a UUID string")
        UUID(value)
        return value
    except vol.Invalid:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager UUID service value is invalid")
        raise vol.Invalid("expected a UUID string") from err


def _validate_service_time(value: object) -> time:
    """Validate a service action reminder time."""
    _LOGGER.debug("Validating Medication Manager service reminder time")
    try:
        if isinstance(value, time):
            reminder_time = value
        elif isinstance(value, str):
            reminder_time = time.fromisoformat(value)
        else:
            raise vol.Invalid("expected HH:MM time")

        if (
            reminder_time.tzinfo is not None
            or reminder_time.second
            or reminder_time.microsecond
        ):
            raise vol.Invalid("expected HH:MM time")
        return reminder_time
    except vol.Invalid:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager service reminder time is invalid")
        raise vol.Invalid("expected HH:MM time") from err


def _validate_datetime(value: object) -> datetime:
    """Validate a service action value as an aware datetime."""
    _LOGGER.debug("Validating Medication Manager service datetime")
    try:
        if isinstance(value, datetime):
            parsed = value
        elif isinstance(value, str):
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        else:
            raise vol.Invalid("expected datetime")

        if parsed.tzinfo is None:
            raise vol.Invalid("expected timezone-aware datetime")
        return parsed
    except vol.Invalid:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager service datetime is invalid")
        raise vol.Invalid("expected timezone-aware datetime") from err


def _validate_history_source(value: object) -> str:
    """Validate a service action history source."""
    _LOGGER.debug("Validating Medication Manager history source service value")
    try:
        if not isinstance(value, str):
            raise vol.Invalid("expected history source")
        return HistorySource(value).value
    except vol.Invalid:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager history source service value is invalid")
        raise vol.Invalid("expected history source") from err


def _validate_take_status(value: object) -> str:
    """Validate a service action intake status."""
    _LOGGER.debug("Validating Medication Manager intake status service value")
    try:
        if not isinstance(value, str):
            raise vol.Invalid("expected intake status")
        status = HistoryStatus(value)
        if status is HistoryStatus.MISSED:
            raise vol.Invalid("take_medication cannot create missed history")
        return status.value
    except vol.Invalid:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager intake status service value is invalid")
        raise vol.Invalid("expected intake status") from err


def _validate_notify_service(value: object) -> str:
    """Validate a mobile app notify service name."""
    _LOGGER.debug("Validating Medication Manager notify service value")
    try:
        if not isinstance(value, str):
            raise vol.Invalid("expected notify service")
        normalized = value.strip().removeprefix("notify.")
        if not normalized.startswith("mobile_app_"):
            raise vol.Invalid("expected mobile_app notify service")
        return normalized
    except vol.Invalid:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager notify service value is invalid")
        raise vol.Invalid("expected mobile_app notify service") from err


def _validate_snooze_minutes(value: object) -> int:
    """Validate notification snooze minutes."""
    _LOGGER.debug("Validating Medication Manager snooze minutes")
    try:
        minutes = vol.Coerce(int)(value)
        if minutes < 1 or minutes > 240:
            raise vol.Invalid("expected value from 1 to 240")
        return minutes
    except vol.Invalid:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager snooze minutes value is invalid")
        raise vol.Invalid("expected value from 1 to 240") from err


_REMINDER_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TIME): _validate_service_time,
        vol.Optional(ATTR_ENABLED, default=True): cv.boolean,
    }
)

ADD_MEDICATION_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
        vol.Required(ATTR_NAME): cv.string,
        vol.Optional(ATTR_ICON, default=DEFAULT_MEDICATION_ICON): cv.string,
        vol.Optional(ATTR_TAG_ID): cv.string,
        vol.Optional(ATTR_ENABLED, default=True): cv.boolean,
        vol.Optional(ATTR_REMINDERS, default=[]): vol.All(
            _ensure_list,
            [_REMINDER_SCHEMA],
        ),
    }
)

UPDATE_MEDICATION_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
        vol.Required(ATTR_MEDICATION_ID): _validate_uuid_string,
        vol.Optional(ATTR_NAME): cv.string,
        vol.Optional(ATTR_ICON): cv.string,
        vol.Optional(ATTR_TAG_ID): cv.string,
        vol.Optional("clear_tag", default=False): cv.boolean,
        vol.Optional(ATTR_ENABLED): cv.boolean,
        vol.Optional(ATTR_REMINDERS): vol.All(_ensure_list, [_REMINDER_SCHEMA]),
    }
)

DELETE_MEDICATION_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
        vol.Required(ATTR_MEDICATION_ID): _validate_uuid_string,
    }
)

BIND_TAG_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
        vol.Required(ATTR_MEDICATION_ID): _validate_uuid_string,
        vol.Required(ATTR_TAG_ID): cv.string,
    }
)

TAKE_MEDICATION_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
        vol.Required(ATTR_MEDICATION_ID): _validate_uuid_string,
        vol.Optional(ATTR_SCHEDULED_TIME): _validate_datetime,
        vol.Optional(ATTR_TAKEN_TIME): _validate_datetime,
        vol.Optional(ATTR_SOURCE, default=HistorySource.API.value): (
            _validate_history_source
        ),
        vol.Optional(ATTR_STATUS): _validate_take_status,
    }
)

SEND_REMINDER_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
        vol.Required(ATTR_MEDICATION_ID): _validate_uuid_string,
        vol.Required(ATTR_NOTIFY_SERVICE): _validate_notify_service,
        vol.Optional(ATTR_SCHEDULED_TIME): _validate_datetime,
        vol.Optional(ATTR_TITLE): cv.string,
        vol.Optional(ATTR_MESSAGE): cv.string,
        vol.Optional(ATTR_SNOOZE_MINUTES, default=10): _validate_snooze_minutes,
    }
)
