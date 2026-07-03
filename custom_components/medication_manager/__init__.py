"""Medication Manager integration setup."""

from __future__ import annotations

import logging

from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.typing import ConfigType

from .api import async_setup_api
from .const import DOMAIN, PLATFORMS
from .coordinator import MedicationManagerCoordinator
from .frontend import async_setup_frontend
from .manager import MedicationManager
from .nfc import MedicationNfcEngine
from .notifications import MedicationNotificationEngine
from .runtime import MedicationManagerConfigEntry, MedicationManagerRuntimeData
from .scheduler import MedicationReminderScheduler
from .services import async_setup_services
from .storage import MedicationManagerStore

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up Medication Manager domain services."""
    _LOGGER.debug("Setting up %s domain", DOMAIN)
    try:
        if DOMAIN in config:
            _LOGGER.warning(
                "Medication Manager ignores YAML configuration; use the UI instead"
            )
        await async_setup_services(hass)
        await async_setup_api(hass)
        await async_setup_frontend(hass)
    except HomeAssistantError:
        _LOGGER.exception("Failed to set up %s domain", DOMAIN)
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected error setting up %s domain", DOMAIN)
        raise HomeAssistantError("Medication Manager domain setup failed") from err

    _LOGGER.debug("%s domain setup complete", DOMAIN)
    return True


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
        notifications = MedicationNotificationEngine(
            hass,
            manager,
            coordinator.async_refresh_after_mutation,
        )
        nfc = MedicationNfcEngine(
            hass,
            manager,
            notifications,
            coordinator.async_refresh_after_mutation,
        )
        scheduler = MedicationReminderScheduler(
            hass,
            entry,
            manager,
            notifications,
            coordinator.async_refresh_after_mutation,
        )

        await manager.async_initialize()
        await coordinator.async_config_entry_first_refresh()
        await notifications.async_start()
        await scheduler.async_start()
        await nfc.async_start()
        entry.async_on_unload(entry.add_update_listener(_async_update_listener))
        entry.runtime_data = MedicationManagerRuntimeData(
            manager=manager,
            coordinator=coordinator,
            notifications=notifications,
            scheduler=scheduler,
            nfc=nfc,
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
            await entry.runtime_data.nfc.async_stop()
            await entry.runtime_data.scheduler.async_stop()
            await entry.runtime_data.notifications.async_stop()
            await entry.runtime_data.manager.async_shutdown()
            _LOGGER.info("Medication Manager config entry %s unloaded", entry.entry_id)

        return unload_ok
    except HomeAssistantError:
        _LOGGER.exception("Failed to unload %s config entry %s", DOMAIN, entry.entry_id)
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected error unloading %s", DOMAIN)
        raise HomeAssistantError("Medication Manager unload failed") from err


async def _async_update_listener(
    hass: HomeAssistant,
    entry: MedicationManagerConfigEntry,
) -> None:
    """Reload Medication Manager when config entry options change."""
    _LOGGER.debug("Reloading Medication Manager config entry %s", entry.entry_id)
    try:
        await hass.config_entries.async_reload(entry.entry_id)
    except HomeAssistantError:
        _LOGGER.exception(
            "Failed to reload Medication Manager config entry %s",
            entry.entry_id,
        )
        raise
    except Exception as err:
        entry_name = entry.data.get(CONF_NAME, entry.entry_id)
        _LOGGER.exception(
            "Unexpected reload failure for Medication Manager %s",
            entry_name,
        )
        raise HomeAssistantError("Medication Manager reload failed") from err
