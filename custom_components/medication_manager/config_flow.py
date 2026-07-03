"""Config flow for Medication Manager."""

from __future__ import annotations

import logging
from typing import Any, cast

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.core import callback
from homeassistant.data_entry_flow import AbortFlow

from .const import CONF_NOTIFY_SERVICE, CONF_SNOOZE_MINUTES, DOMAIN, NAME

_LOGGER = logging.getLogger(__name__)

DEFAULT_SNOOZE_MINUTES = 10


class MedicationManagerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a Medication Manager config flow."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: ConfigEntry[object],
    ) -> MedicationManagerOptionsFlow:
        """Return the Medication Manager options flow."""
        _LOGGER.debug("Creating Medication Manager options flow")
        try:
            return MedicationManagerOptionsFlow(config_entry)
        except Exception as err:
            _LOGGER.exception("Medication Manager options flow creation failed")
            raise RuntimeError("Medication Manager options flow failed") from err

    async def async_step_user(
        self,
        user_input: dict[str, Any] | None = None,
    ) -> ConfigFlowResult:
        """Create the single Medication Manager config entry from the UI."""
        _LOGGER.debug("Starting Medication Manager user config flow")
        try:
            await self.async_set_unique_id(DOMAIN)
            self._abort_if_unique_id_configured()

            if user_input is not None:
                data = _normalized_options(user_input)
                _LOGGER.info("Creating Medication Manager config entry")
                return self.async_create_entry(title=NAME, data=data)

            return self.async_show_form(
                step_id="user",
                data_schema=_options_schema({}),
                errors={},
            )
        except AbortFlow:
            _LOGGER.debug("Medication Manager config flow aborted by Home Assistant")
            raise
        except ValueError as err:
            _LOGGER.warning("Medication Manager config flow validation failed: %s", err)
            return self.async_show_form(
                step_id="user",
                data_schema=_options_schema(user_input or {}),
                errors={"base": str(err)},
            )
        except Exception:
            _LOGGER.exception("Medication Manager config flow failed")
            return self.async_show_form(
                step_id="user",
                data_schema=_options_schema(user_input or {}),
                errors={"base": "unknown"},
            )


class MedicationManagerOptionsFlow(config_entries.OptionsFlow):
    """Handle Medication Manager options from the UI."""

    def __init__(self, config_entry: ConfigEntry[object]) -> None:
        """Initialize the options flow."""
        _LOGGER.debug("Initializing Medication Manager options flow")
        try:
            self._config_entry = config_entry
        except Exception as err:
            _LOGGER.exception("Medication Manager options flow initialization failed")
            raise RuntimeError("Medication Manager options flow failed") from err

    async def async_step_init(
        self,
        user_input: dict[str, Any] | None = None,
    ) -> ConfigFlowResult:
        """Update Medication Manager options from the UI."""
        _LOGGER.debug("Starting Medication Manager options flow")
        try:
            defaults = {
                **dict(self._config_entry.data),
                **dict(self._config_entry.options),
            }
            if user_input is not None:
                return self.async_create_entry(
                    title="",
                    data=_normalized_options(user_input),
                )

            return self.async_show_form(
                step_id="init",
                data_schema=_options_schema(defaults),
                errors={},
            )
        except ValueError as err:
            _LOGGER.warning(
                "Medication Manager options flow validation failed: %s",
                err,
            )
            return self.async_show_form(
                step_id="init",
                data_schema=_options_schema(user_input or defaults),
                errors={"base": str(err)},
            )
        except Exception:
            _LOGGER.exception("Medication Manager options flow failed")
            return self.async_show_form(
                step_id="init",
                data_schema=_options_schema(user_input or {}),
                errors={"base": "unknown"},
            )


def _options_schema(defaults: dict[str, Any]) -> vol.Schema:
    """Return the config and options form schema."""
    _LOGGER.debug("Building Medication Manager options schema")
    try:
        return vol.Schema(
            {
                vol.Optional(
                    CONF_NOTIFY_SERVICE,
                    default=str(defaults.get(CONF_NOTIFY_SERVICE, "")),
                ): str,
                vol.Optional(
                    CONF_SNOOZE_MINUTES,
                    default=_default_snooze_minutes(defaults),
                ): vol.All(vol.Coerce(int), vol.Range(min=1, max=240)),
            }
        )
    except Exception as err:
        _LOGGER.exception("Medication Manager options schema failed")
        raise RuntimeError("Medication Manager options schema failed") from err


def _normalized_options(user_input: dict[str, Any]) -> dict[str, Any]:
    """Normalize config and options flow input."""
    _LOGGER.debug("Normalizing Medication Manager options")
    try:
        raw_notify_service = user_input.get(CONF_NOTIFY_SERVICE, "")
        if not isinstance(raw_notify_service, str):
            raise ValueError("invalid_notify_service")
        notify_service = _normalize_notify_service(raw_notify_service)
        snooze_minutes = int(
            user_input.get(CONF_SNOOZE_MINUTES, DEFAULT_SNOOZE_MINUTES)
        )
        if snooze_minutes < 1 or snooze_minutes > 240:
            raise ValueError("invalid_snooze_minutes")

        data: dict[str, Any] = {CONF_SNOOZE_MINUTES: snooze_minutes}
        if notify_service is not None:
            data[CONF_NOTIFY_SERVICE] = notify_service
        return data
    except ValueError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager options normalization failed")
        raise ValueError("unknown") from err


def _default_snooze_minutes(defaults: dict[str, Any]) -> int:
    """Return a safe snooze minutes default for UI forms."""
    _LOGGER.debug("Reading Medication Manager default snooze minutes")
    try:
        value = int(defaults.get(CONF_SNOOZE_MINUTES, DEFAULT_SNOOZE_MINUTES))
        if value < 1 or value > 240:
            return DEFAULT_SNOOZE_MINUTES
        return value
    except Exception:
        _LOGGER.exception("Medication Manager default snooze minutes is invalid")
        return DEFAULT_SNOOZE_MINUTES


def _normalize_notify_service(value: str) -> str | None:
    """Normalize an optional mobile app notify service name."""
    _LOGGER.debug("Normalizing Medication Manager notify service option")
    try:
        normalized = value.strip().removeprefix("notify.")
        if not normalized:
            return None
        if not normalized.startswith("mobile_app_"):
            raise ValueError("invalid_notify_service")
        return normalized
    except ValueError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager notify service option is invalid")
        raise ValueError("invalid_notify_service") from err
