"""Frontend static asset setup for Medication Manager."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = Path(__file__).parent / "frontend"
FRONTEND_URL = f"/{DOMAIN}/frontend"


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
                    True,
                )
            ]
        )
    except Exception as err:
        _LOGGER.exception("Medication Manager frontend setup failed")
        raise HomeAssistantError("Medication Manager frontend setup failed") from err

