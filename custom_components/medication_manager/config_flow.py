"""Config flow for Medication Manager."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.data_entry_flow import AbortFlow

from .const import DOMAIN, NAME

_LOGGER = logging.getLogger(__name__)


class MedicationManagerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a Medication Manager config flow."""

    VERSION = 1

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
                _LOGGER.info("Creating Medication Manager config entry")
                return self.async_create_entry(title=NAME, data={})

            return self.async_show_form(
                step_id="user",
                data_schema=vol.Schema({}),
                errors={},
            )
        except AbortFlow:
            _LOGGER.debug("Medication Manager config flow aborted by Home Assistant")
            raise
        except Exception:
            _LOGGER.exception("Medication Manager config flow failed")
            return self.async_show_form(
                step_id="user",
                data_schema=vol.Schema({}),
                errors={"base": "unknown"},
            )

