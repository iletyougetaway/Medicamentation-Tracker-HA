"""Runtime typing helpers for Medication Manager."""

from __future__ import annotations

from dataclasses import dataclass
from typing import TypeAlias

from homeassistant.config_entries import ConfigEntry

from .coordinator import MedicationManagerCoordinator
from .manager import MedicationManager


@dataclass(slots=True)
class MedicationManagerRuntimeData:
    """Runtime objects owned by a Medication Manager config entry."""

    manager: MedicationManager
    coordinator: MedicationManagerCoordinator


MedicationManagerConfigEntry: TypeAlias = ConfigEntry[MedicationManagerRuntimeData]

