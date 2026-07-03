"""Storage-backed state manager for Medication Manager."""

from __future__ import annotations

import asyncio
import logging

from homeassistant.exceptions import HomeAssistantError

from .models import MedicationManagerStoreData
from .storage import MedicationManagerStore

_LOGGER = logging.getLogger(__name__)


class MedicationManager:
    """Manage Medication Manager state loaded from Home Assistant storage."""

    def __init__(self, store: MedicationManagerStore) -> None:
        """Initialize the manager with a storage backend."""
        _LOGGER.debug("Initializing Medication Manager state manager")
        try:
            self._store = store
            self._lock = asyncio.Lock()
            self._data: MedicationManagerStoreData | None = None
        except Exception as err:
            _LOGGER.exception("Failed to initialize Medication Manager state manager")
            raise HomeAssistantError("Medication Manager initialization failed") from err

    async def async_initialize(self) -> None:
        """Load Medication Manager state from storage."""
        _LOGGER.debug("Loading Medication Manager state")
        try:
            async with self._lock:
                if self._data is None:
                    self._data = await self._store.async_load()
                    _LOGGER.info("Medication Manager state loaded")
                else:
                    _LOGGER.debug("Medication Manager state was already loaded")
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager state loading failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error loading Medication Manager state")
            raise HomeAssistantError("Medication Manager state loading failed") from err

    async def async_shutdown(self) -> None:
        """Release the in-memory Medication Manager state."""
        _LOGGER.debug("Shutting down Medication Manager state manager")
        try:
            async with self._lock:
                self._data = None
        except Exception as err:
            _LOGGER.exception("Medication Manager shutdown failed")
            raise HomeAssistantError("Medication Manager shutdown failed") from err

    async def async_get_snapshot(self) -> MedicationManagerStoreData:
        """Return the current immutable Medication Manager snapshot."""
        _LOGGER.debug("Reading Medication Manager state snapshot")
        try:
            async with self._lock:
                return self._require_data()
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager snapshot is unavailable")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error reading Medication Manager snapshot")
            raise HomeAssistantError("Medication Manager snapshot failed") from err

    async def async_replace_data(
        self,
        data: MedicationManagerStoreData,
    ) -> MedicationManagerStoreData:
        """Persist and publish a complete Medication Manager state replacement."""
        _LOGGER.debug("Persisting Medication Manager state replacement")
        try:
            async with self._lock:
                await self._store.async_save(data)
                self._data = data
                return data
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager state replacement failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error replacing Medication Manager state")
            raise HomeAssistantError("Medication Manager state replacement failed") from err

    def _require_data(self) -> MedicationManagerStoreData:
        """Return loaded data or raise a Home Assistant error."""
        _LOGGER.debug("Validating loaded Medication Manager state")
        try:
            if self._data is None:
                raise HomeAssistantError("Medication Manager state is not loaded")
            return self._data
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager state validation failed")
            raise HomeAssistantError("Medication Manager state validation failed") from err

