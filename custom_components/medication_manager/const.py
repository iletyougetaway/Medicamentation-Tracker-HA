"""Constants for Medication Manager."""

from __future__ import annotations

from homeassistant.const import Platform

DOMAIN = "medication_manager"
NAME = "Менеджер лекарств"
VERSION = "0.7.4"

STORAGE_KEY = f"{DOMAIN}.storage"
STORAGE_VERSION = 1

DEFAULT_MEDICATION_ICON = "mdi:pill"

PLATFORMS: tuple[Platform, ...] = ()

DATA_SERVICES_REGISTERED = "services_registered"
DATA_API_REGISTERED = "api_registered"

ATTR_CONFIG_ENTRY_ID = "config_entry_id"
ATTR_ENABLED = "enabled"
ATTR_ICON = "icon"
ATTR_MEDICATION_ID = "medication_id"
ATTR_MESSAGE = "message"
ATTR_NAME = "name"
ATTR_NOTIFY_SERVICE = "notify_service"
ATTR_REMINDERS = "reminders"
ATTR_SCHEDULED_TIME = "scheduled_time"
ATTR_SNOOZE_MINUTES = "snooze_minutes"
ATTR_SOURCE = "source"
ATTR_STATUS = "status"
ATTR_TAG_ID = "tag_id"
ATTR_TAKEN_TIME = "taken_time"
ATTR_TIME = "time"
ATTR_TITLE = "title"

CONF_NOTIFY_SERVICE = ATTR_NOTIFY_SERVICE
CONF_SNOOZE_MINUTES = ATTR_SNOOZE_MINUTES

SERVICE_ADD_MEDICATION = "add_medication"
SERVICE_BIND_TAG = "bind_tag"
SERVICE_DELETE_MEDICATION = "delete_medication"
SERVICE_SEND_REMINDER = "send_reminder"
SERVICE_TAKE_MEDICATION = "take_medication"
SERVICE_UPDATE_MEDICATION = "update_medication"

EVENT_REMIND_LATER = f"{DOMAIN}_remind_later"
EVENT_DATA_UPDATED = f"{DOMAIN}_data_updated"

SETTINGS_ACTIVE_NOTIFICATIONS = "active_notifications"
