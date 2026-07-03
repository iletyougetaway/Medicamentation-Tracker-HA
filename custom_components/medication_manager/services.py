"""Service actions for Medication Manager."""

from __future__ import annotations

from collections.abc import Mapping
from datetime import time
import logging
from typing import TYPE_CHECKING, Any, cast
from uuid import UUID

import voluptuous as vol

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
import homeassistant.helpers.config_validation as cv

from .const import (
    ATTR_CONFIG_ENTRY_ID,
    ATTR_ENABLED,
    ATTR_ICON,
    ATTR_MEDICATION_ID,
    ATTR_NAME,
    ATTR_REMINDERS,
    ATTR_TAG_ID,
    ATTR_TIME,
    DATA_SERVICES_REGISTERED,
    DEFAULT_MEDICATION_ICON,
    DOMAIN,
    SERVICE_ADD_MEDICATION,
    SERVICE_BIND_TAG,
    SERVICE_DELETE_MEDICATION,
    SERVICE_UPDATE_MEDICATION,
)
from .manager import MedicationManagerError
from .models import Medication, MedicationReminder

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


def _runtime_from_call(call: ServiceCall) -> MedicationManagerRuntimeData:
    """Resolve runtime data for the service action config entry."""
    _LOGGER.debug("Resolving Medication Manager runtime data for service action")
    try:
        config_entry_id = cast(str, call.data[ATTR_CONFIG_ENTRY_ID])
        entry = call.hass.config_entries.async_get_entry(config_entry_id)
        if entry is None or entry.domain != DOMAIN:
            raise ServiceValidationError("Medication Manager config entry was not found")
        if entry.state is not ConfigEntryState.LOADED:
            raise ServiceValidationError("Medication Manager config entry is not loaded")

        runtime_data = getattr(entry, "runtime_data", None)
        if runtime_data is None:
            raise ServiceValidationError("Medication Manager runtime data is missing")
        return cast("MedicationManagerRuntimeData", runtime_data)
    except ServiceValidationError:
        raise
    except Exception as err:
        _LOGGER.exception("Unable to resolve Medication Manager runtime data")
        raise HomeAssistantError("Medication Manager runtime resolution failed") from err


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
