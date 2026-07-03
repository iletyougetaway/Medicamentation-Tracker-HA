"""Runtime typing helpers for Medication Manager."""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, TypeAlias

from homeassistant.config_entries import ConfigEntry

if TYPE_CHECKING:
    from .coordinator import MedicationManagerCoordinator
    from .manager import MedicationManager
    from .nfc import MedicationNfcEngine
    from .notifications import MedicationNotificationEngine
    from .scheduler import MedicationReminderScheduler


@dataclass(slots=True)
class MedicationManagerRuntimeData:
    """Runtime objects owned by a Medication Manager config entry."""

    manager: MedicationManager
    coordinator: MedicationManagerCoordinator
    notifications: MedicationNotificationEngine
    scheduler: MedicationReminderScheduler
    nfc: MedicationNfcEngine


MedicationManagerConfigEntry: TypeAlias = ConfigEntry[MedicationManagerRuntimeData]
