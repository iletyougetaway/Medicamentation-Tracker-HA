"""Constants for Medication Manager."""

from __future__ import annotations

from homeassistant.const import Platform

DOMAIN = "medication_manager"
NAME = "Medication Manager"
VERSION = "0.3.0"

STORAGE_KEY = f"{DOMAIN}.storage"
STORAGE_VERSION = 1

DEFAULT_MEDICATION_ICON = "mdi:pill"

PLATFORMS: tuple[Platform, ...] = ()

DATA_SERVICES_REGISTERED = "services_registered"

ATTR_CONFIG_ENTRY_ID = "config_entry_id"
ATTR_ENABLED = "enabled"
ATTR_ICON = "icon"
ATTR_MEDICATION_ID = "medication_id"
ATTR_NAME = "name"
ATTR_REMINDERS = "reminders"
ATTR_SCHEDULED_TIME = "scheduled_time"
ATTR_SOURCE = "source"
ATTR_STATUS = "status"
ATTR_TAG_ID = "tag_id"
ATTR_TAKEN_TIME = "taken_time"
ATTR_TIME = "time"

SERVICE_ADD_MEDICATION = "add_medication"
SERVICE_BIND_TAG = "bind_tag"
SERVICE_DELETE_MEDICATION = "delete_medication"
SERVICE_TAKE_MEDICATION = "take_medication"
SERVICE_UPDATE_MEDICATION = "update_medication"
