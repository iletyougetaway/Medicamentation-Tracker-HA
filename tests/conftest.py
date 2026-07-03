"""Pytest bootstrap helpers for Medication Manager."""

from __future__ import annotations

import importlib.util
from enum import StrEnum
from pathlib import Path
import sys
from types import ModuleType

if importlib.util.find_spec("homeassistant") is None:
    homeassistant = ModuleType("homeassistant")
    components = ModuleType("homeassistant.components")
    components_tag = ModuleType("homeassistant.components.tag")
    components_tag_const = ModuleType("homeassistant.components.tag.const")
    config_entries = ModuleType("homeassistant.config_entries")
    core = ModuleType("homeassistant.core")
    data_entry_flow = ModuleType("homeassistant.data_entry_flow")
    exceptions = ModuleType("homeassistant.exceptions")
    const = ModuleType("homeassistant.const")
    helpers = ModuleType("homeassistant.helpers")
    helpers_event = ModuleType("homeassistant.helpers.event")
    helpers_storage = ModuleType("homeassistant.helpers.storage")
    util = ModuleType("homeassistant.util")
    util_dt = ModuleType("homeassistant.util.dt")

    class HomeAssistantError(Exception):
        """Fallback Home Assistant error for isolated unit tests."""

    class HomeAssistant:
        """Fallback Home Assistant instance for isolated unit tests."""

        def __init__(self) -> None:
            """Initialize a fallback Home Assistant instance."""
            self.bus = EventBus()

    class EventBus:
        """Fallback Home Assistant event bus for isolated unit tests."""

        def async_listen(self, *_args: object, **_kwargs: object) -> None:
            """Fallback event listener registration."""
            return None

    class Event:
        """Fallback Home Assistant event for isolated unit tests."""

    class ConfigEntry:
        """Fallback Home Assistant config entry for isolated unit tests."""

    class ConfigFlow:
        """Fallback Home Assistant config flow for isolated unit tests."""

        def __init_subclass__(cls, **_kwargs: object) -> None:
            """Accept Home Assistant config flow subclass keywords."""
            return None

    class OptionsFlow:
        """Fallback Home Assistant options flow for isolated unit tests."""

    class AbortFlow(Exception):
        """Fallback Home Assistant abort flow exception."""

    class Store:
        """Fallback Home Assistant storage class for isolated unit tests."""

    class Platform(StrEnum):
        """Fallback Home Assistant platform enum for isolated unit tests."""

        SENSOR = "sensor"

    def callback(func: object) -> object:
        """Return a callback unchanged for isolated unit tests."""
        return func

    def async_call_later(*_args: object, **_kwargs: object) -> None:
        """Fallback delayed callback tracker for isolated unit tests."""
        return None

    def async_track_point_in_time(*_args: object, **_kwargs: object) -> None:
        """Fallback point-in-time tracker for isolated unit tests."""
        return None

    core.HomeAssistant = HomeAssistant
    core.Event = Event
    core.CALLBACK_TYPE = object
    core.callback = callback
    config_entries.ConfigEntry = ConfigEntry
    config_entries.ConfigFlow = ConfigFlow
    config_entries.OptionsFlow = OptionsFlow
    config_entries.ConfigFlowResult = dict[str, object]
    data_entry_flow.AbortFlow = AbortFlow
    components_tag_const.EVENT_TAG_SCANNED = "tag_scanned"
    components_tag_const.TAG_ID = "tag_id"
    exceptions.HomeAssistantError = HomeAssistantError
    const.Platform = Platform
    helpers_event.async_call_later = async_call_later
    helpers_event.async_track_point_in_time = async_track_point_in_time
    helpers_storage.Store = Store
    util_dt.now = lambda: __import__("datetime").datetime.now().astimezone()
    setattr(homeassistant, "exceptions", exceptions)
    setattr(homeassistant, "const", const)
    setattr(homeassistant, "core", core)
    setattr(homeassistant, "config_entries", config_entries)
    setattr(homeassistant, "components", components)
    setattr(homeassistant, "data_entry_flow", data_entry_flow)
    setattr(homeassistant, "helpers", helpers)
    setattr(homeassistant, "util", util)
    setattr(helpers, "event", helpers_event)
    setattr(helpers, "storage", helpers_storage)
    setattr(components, "tag", components_tag)
    setattr(components_tag, "const", components_tag_const)
    setattr(util, "dt", util_dt)
    sys.modules.setdefault("homeassistant", homeassistant)
    sys.modules.setdefault("homeassistant.components", components)
    sys.modules.setdefault("homeassistant.components.tag", components_tag)
    sys.modules.setdefault("homeassistant.components.tag.const", components_tag_const)
    sys.modules.setdefault("homeassistant.config_entries", config_entries)
    sys.modules.setdefault("homeassistant.core", core)
    sys.modules.setdefault("homeassistant.data_entry_flow", data_entry_flow)
    sys.modules.setdefault("homeassistant.exceptions", exceptions)
    sys.modules.setdefault("homeassistant.const", const)
    sys.modules.setdefault("homeassistant.helpers", helpers)
    sys.modules.setdefault("homeassistant.helpers.event", helpers_event)
    sys.modules.setdefault("homeassistant.helpers.storage", helpers_storage)
    sys.modules.setdefault("homeassistant.util", util)
    sys.modules.setdefault("homeassistant.util.dt", util_dt)

    package = ModuleType("custom_components.medication_manager")
    package_path = (
        Path(__file__).resolve().parents[1]
        / "custom_components"
        / "medication_manager"
    )
    setattr(package, "__path__", [str(package_path)])
    sys.modules.setdefault("custom_components.medication_manager", package)
