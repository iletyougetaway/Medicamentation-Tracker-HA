"""Home Assistant storage helpers for Medication Manager."""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .models import JsonObject, MedicationManagerStoreData

_LOGGER = logging.getLogger(__name__)


class MedicationManagerStore:
    """Persist Medication Manager state with Home Assistant's storage API."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the Home Assistant storage wrapper."""
        _LOGGER.debug("Initializing Medication Manager storage")
        try:
            self._store: Store[JsonObject] = Store(
                hass,
                STORAGE_VERSION,
                STORAGE_KEY,
            )
        except Exception as err:
            _LOGGER.exception("Medication Manager storage initialization failed")
            raise HomeAssistantError(
                "Не удалось инициализировать хранилище Менеджера лекарств"
            ) from err

    async def async_load(self) -> MedicationManagerStoreData:
        """Load Medication Manager data from Home Assistant storage."""
        _LOGGER.debug("Loading Medication Manager storage data")
        try:
            stored = await self._store.async_load()
            if stored is None:
                _LOGGER.info("Creating initial Medication Manager storage data")
                data = MedicationManagerStoreData.empty(STORAGE_VERSION)
                await self.async_save(data)
                return data

            data = MedicationManagerStoreData.from_storage(stored)
            if data.version != STORAGE_VERSION:
                raise HomeAssistantError(
                    f"Неподдерживаемая версия хранилища Менеджера лекарств: {data.version}"
                )
            return data
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager storage load failed")
            raise
        except ValueError as err:
            _LOGGER.exception("Medication Manager storage data is invalid")
            raise HomeAssistantError(
                "Данные хранилища Менеджера лекарств повреждены"
            ) from err
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager storage load error")
            raise HomeAssistantError(
                "Не удалось загрузить хранилище Менеджера лекарств"
            ) from err

    async def async_save(self, data: MedicationManagerStoreData) -> None:
        """Save Medication Manager data to Home Assistant storage."""
        _LOGGER.debug("Saving Medication Manager storage data")
        try:
            await self._store.async_save(data.as_storage())
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager storage save failed")
            raise
        except ValueError as err:
            _LOGGER.exception("Medication Manager storage serialization failed")
            raise HomeAssistantError(
                "Не удалось сериализовать хранилище Менеджера лекарств"
            ) from err
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager storage save error")
            raise HomeAssistantError(
                "Не удалось сохранить хранилище Менеджера лекарств"
            ) from err
