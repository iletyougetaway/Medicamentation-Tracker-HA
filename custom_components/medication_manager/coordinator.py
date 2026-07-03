"""Data update coordinator for Medication Manager."""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import DOMAIN
from .manager import MedicationManager
from .models import MedicationManagerStoreData

_LOGGER = logging.getLogger(__name__)


class MedicationManagerCoordinator(DataUpdateCoordinator[MedicationManagerStoreData]):
    """Coordinate Medication Manager state snapshots for entities and frontend APIs."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry[object],
        manager: MedicationManager,
    ) -> None:
        """Initialize the Medication Manager coordinator."""
        _LOGGER.debug("Initializing Medication Manager coordinator")
        try:
            super().__init__(
                hass,
                _LOGGER,
                config_entry=entry,
                name=DOMAIN,
                always_update=False,
            )
            self._manager = manager
        except Exception as err:
            _LOGGER.exception("Failed to initialize Medication Manager coordinator")
            raise HomeAssistantError(
                "Medication Manager coordinator initialization failed"
            ) from err

    async def _async_update_data(self) -> MedicationManagerStoreData:
        """Fetch the latest storage-backed Medication Manager snapshot."""
        _LOGGER.debug("Refreshing Medication Manager coordinator data")
        try:
            return await self._manager.async_get_snapshot()
        except HomeAssistantError as err:
            _LOGGER.exception("Medication Manager snapshot refresh failed")
            raise UpdateFailed(str(err)) from err
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager coordinator error")
            raise UpdateFailed("Medication Manager coordinator refresh failed") from err

    async def async_refresh_after_mutation(self) -> None:
        """Push the latest manager snapshot to coordinator listeners."""
        _LOGGER.debug("Publishing Medication Manager state after mutation")
        try:
            self.async_set_updated_data(await self._manager.async_get_snapshot())
        except HomeAssistantError:
            _LOGGER.exception("Unable to publish Medication Manager state")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error publishing Medication Manager state")
            raise HomeAssistantError(
                "Medication Manager coordinator publish failed"
            ) from err

