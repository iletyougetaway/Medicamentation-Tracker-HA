"""Constants for Medication Manager."""

from __future__ import annotations

from homeassistant.const import Platform

DOMAIN = "medication_manager"
NAME = "Medication Manager"
VERSION = "0.1.0"

STORAGE_KEY = f"{DOMAIN}.storage"
STORAGE_VERSION = 1

DEFAULT_MEDICATION_ICON = "mdi:pill"

PLATFORMS: tuple[Platform, ...] = ()

