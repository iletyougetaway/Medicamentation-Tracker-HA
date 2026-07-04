"""Frontend static asset setup for Medication Manager."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, cast

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN, VERSION

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = Path(__file__).parent / "frontend"
FRONTEND_URL = f"/{DOMAIN}/frontend"
FRONTEND_CARD_FILENAME = "medication-manager-card.js"
FRONTEND_CARD_URL = f"{FRONTEND_URL}/{FRONTEND_CARD_FILENAME}?v={VERSION}"
LOVELACE_RESOURCE_TYPE = "module"


async def async_setup_frontend(hass: HomeAssistant) -> None:
    """Register Medication Manager static frontend assets."""
    _LOGGER.debug("Registering Medication Manager frontend assets")
    try:
        if not FRONTEND_DIR.exists():
            _LOGGER.warning("Medication Manager frontend assets are missing")
            return
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    FRONTEND_URL,
                    str(FRONTEND_DIR),
                    False,
                )
            ]
        )
        await _async_register_lovelace_resource(hass)
    except Exception as err:
        _LOGGER.exception("Medication Manager frontend setup failed")
        raise HomeAssistantError(
            "Не удалось настроить frontend Менеджера лекарств"
        ) from err


async def _async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """Add the bundled card to Lovelace resources when dashboards use storage."""
    _LOGGER.debug("Registering Medication Manager Lovelace resource")
    try:
        lovelace = hass.data.get("lovelace")
        resources = getattr(lovelace, "resources", None)
        if resources is None:
            _LOGGER.warning(
                "Не удалось автоматически добавить карточку Менеджера лекарств в "
                "ресурсы панели управления: Lovelace resources недоступны. "
                "Добавьте %s вручную.",
                FRONTEND_CARD_URL,
            )
            return

        async_load = getattr(resources, "async_load", None)
        if callable(async_load):
            await async_load()

        current = cast(list[dict[str, Any]], resources.async_items())
        existing = _resource_with_same_path(current)
        if existing is None:
            await resources.async_create_item(
                {
                    "res_type": LOVELACE_RESOURCE_TYPE,
                    "url": FRONTEND_CARD_URL,
                }
            )
            return

        if (
            existing.get("url") == FRONTEND_CARD_URL
            and _resource_type(existing) == LOVELACE_RESOURCE_TYPE
        ):
            return

        resource_id = cast(str | None, existing.get("id"))
        if resource_id is None:
            _LOGGER.debug("Existing Medication Manager resource has no id")
            return
        await resources.async_update_item(
            resource_id,
            {
                "res_type": LOVELACE_RESOURCE_TYPE,
                "url": FRONTEND_CARD_URL,
            },
        )
    except HomeAssistantError:
        _LOGGER.warning(
            "Не удалось автоматически добавить карточку Менеджера лекарств в "
            "ресурсы панели управления. Добавьте %s вручную.",
            FRONTEND_CARD_URL,
            exc_info=True,
        )
    except AttributeError:
        _LOGGER.warning(
            "Не удалось автоматически добавить карточку Менеджера лекарств в "
            "ресурсы панели управления. Если используется YAML mode, добавьте "
            "%s вручную.",
            FRONTEND_CARD_URL,
        )
    except Exception:
        _LOGGER.exception("Medication Manager Lovelace resource setup failed")
        _LOGGER.warning(
            "Не удалось автоматически добавить карточку Менеджера лекарств в "
            "ресурсы панели управления. Добавьте %s вручную.",
            FRONTEND_CARD_URL,
        )


def _resource_with_same_path(resources: list[dict[str, Any]]) -> dict[str, Any] | None:
    """Return an existing Lovelace resource that points at this card file."""
    _LOGGER.debug("Looking up existing Medication Manager Lovelace resource")
    try:
        for resource in resources:
            url = resource.get("url")
            if isinstance(url, str) and url.split("?", 1)[0] == (
                f"{FRONTEND_URL}/{FRONTEND_CARD_FILENAME}"
            ):
                return resource
        return None
    except Exception as err:
        _LOGGER.exception("Medication Manager Lovelace resource lookup failed")
        raise HomeAssistantError(
            "Не удалось проверить ресурсы панели управления"
        ) from err


def _resource_type(resource: dict[str, Any]) -> str | None:
    """Return the Lovelace resource type across storage/API representations."""
    _LOGGER.debug("Resolving Medication Manager Lovelace resource type")
    try:
        resource_type = resource.get("res_type", resource.get("type"))
        return resource_type if isinstance(resource_type, str) else None
    except Exception as err:
        _LOGGER.exception("Medication Manager Lovelace resource type lookup failed")
        raise HomeAssistantError(
            "Не удалось проверить тип ресурса панели управления"
        ) from err
