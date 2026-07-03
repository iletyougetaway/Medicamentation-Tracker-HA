"""Medication Manager integration setup."""

from __future__ import annotations

from dataclasses import dataclass
import logging
from typing import TypeAlias

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN, PLATFORMS
from .coordinator import MedicationManagerCoordinator
from .manager import MedicationManager
from .storage import MedicationManagerStore

_LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class MedicationManagerRuntimeData:
    """Runtime objects owned by a Medication Manager config entry."""

    manager: MedicationManager
    coordinator: MedicationManagerCoordinator


MedicationManagerConfigEntry: TypeAlias = ConfigEntry[MedicationManagerRuntimeData]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: MedicationManagerConfigEntry,
) -> bool:
    """Set up Medication Manager from a config entry."""
    _LOGGER.debug("Setting up %s config entry %s", DOMAIN, entry.entry_id)
    try:
        store = MedicationManagerStore(hass)
        manager = MedicationManager(store)
        coordinator = MedicationManagerCoordinator(hass, entry, manager)

        await manager.async_initialize()
        await coordinator.async_config_entry_first_refresh()
        entry.runtime_data = MedicationManagerRuntimeData(
            manager=manager,
            coordinator=coordinator,
        )

        if PLATFORMS:
            await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    except HomeAssistantError:
        _LOGGER.exception("Failed to set up %s config entry %s", DOMAIN, entry.entry_id)
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected error setting up %s", DOMAIN)
        raise HomeAssistantError("Medication Manager setup failed") from err

    _LOGGER.info("Medication Manager config entry %s is ready", entry.entry_id)
    return True


async def async_unload_entry(
    hass: HomeAssistant,
    entry: MedicationManagerConfigEntry,
) -> bool:
    """Unload a Medication Manager config entry."""
    _LOGGER.debug("Unloading %s config entry %s", DOMAIN, entry.entry_id)
    try:
        unload_ok = True
        if PLATFORMS:
            unload_ok = await hass.config_entries.async_unload_platforms(
                entry,
                PLATFORMS,
            )

        if unload_ok:
            await entry.runtime_data.manager.async_shutdown()
            _LOGGER.info("Medication Manager config entry %s unloaded", entry.entry_id)

        return unload_ok
    except HomeAssistantError:
        _LOGGER.exception("Failed to unload %s config entry %s", DOMAIN, entry.entry_id)
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected error unloading %s", DOMAIN)
        raise HomeAssistantError("Medication Manager unload failed") from err

