"""Tests for Medication Manager domain manager behavior."""

from __future__ import annotations

import asyncio
from datetime import datetime, time, timezone
import logging
from typing import Any, cast

from custom_components.medication_manager.manager import (
    MedicationManager,
    MedicationValidationError,
)
from custom_components.medication_manager.models import (
    HistorySource,
    HistoryStatus,
    MedicationManagerStoreData,
    MedicationReminder,
)

_LOGGER = logging.getLogger(__name__)


class MemoryStore:
    """In-memory storage backend for manager unit tests."""

    def __init__(self) -> None:
        """Initialize the memory store with empty integration data."""
        _LOGGER.debug("Initializing Medication Manager memory test store")
        try:
            self.data = MedicationManagerStoreData.empty(1)
            self.save_count = 0
        except Exception:
            _LOGGER.exception("Unable to initialize memory test store")
            raise

    async def async_load(self) -> MedicationManagerStoreData:
        """Return the current in-memory payload."""
        _LOGGER.debug("Loading Medication Manager memory test data")
        try:
            return self.data
        except Exception:
            _LOGGER.exception("Unable to load memory test data")
            raise

    async def async_save(self, data: MedicationManagerStoreData) -> None:
        """Persist the payload in memory."""
        _LOGGER.debug("Saving Medication Manager memory test data")
        try:
            self.data = data
            self.save_count += 1
        except Exception:
            _LOGGER.exception("Unable to save memory test data")
            raise


def test_manager_crud_and_late_intake() -> None:
    """Verify manager CRUD normalizes data and records late intake history."""
    _LOGGER.debug("Testing Medication Manager CRUD and late intake handling")
    try:
        asyncio.run(_exercise_manager_crud_and_late_intake())
    except Exception:
        _LOGGER.exception("Manager CRUD and late intake test failed")
        raise


def test_manager_rejects_duplicate_tag() -> None:
    """Verify manager prevents binding one NFC tag to multiple medications."""
    _LOGGER.debug("Testing Medication Manager duplicate tag rejection")
    try:
        asyncio.run(_exercise_duplicate_tag_rejection())
    except Exception:
        _LOGGER.exception("Manager duplicate tag test failed")
        raise


async def _exercise_manager_crud_and_late_intake() -> None:
    """Exercise medication CRUD and intake recording on the manager."""
    _LOGGER.debug("Exercising Medication Manager CRUD test flow")
    try:
        store = MemoryStore()
        manager = MedicationManager(cast(Any, store))
        await manager.async_initialize()

        medication = await manager.async_add_medication(
            name=" Vitamin D ",
            tag_id="tag-vitamin-d",
            reminders=(
                MedicationReminder(time=time(20, 0), enabled=True),
                MedicationReminder(time=time(8, 0), enabled=True),
            ),
        )
        assert medication.name == "Vitamin D"
        assert medication.icon == "mdi:pill"
        assert tuple(reminder.time for reminder in medication.schedule) == (
            time(8, 0),
            time(20, 0),
        )

        updated = await manager.async_update_medication(
            medication.id,
            enabled=False,
            clear_tag=True,
            reminders=(),
        )
        assert updated.enabled is False
        assert updated.tag_id is None
        assert updated.schedule == ()

        entry = await manager.async_take_medication(
            medication.id,
            scheduled_time=datetime(2026, 7, 3, 8, 0, tzinfo=timezone.utc),
            taken_time=datetime(2026, 7, 3, 8, 30, tzinfo=timezone.utc),
            source=HistorySource.BUTTON,
        )
        assert entry.status is HistoryStatus.LATE
        assert entry.source is HistorySource.BUTTON

        deleted = await manager.async_delete_medication(medication.id)
        assert deleted.id == medication.id
        assert store.save_count >= 4
    except Exception:
        _LOGGER.exception("Medication Manager CRUD test flow failed")
        raise


async def _exercise_duplicate_tag_rejection() -> None:
    """Exercise duplicate NFC tag validation on the manager."""
    _LOGGER.debug("Exercising Medication Manager duplicate tag flow")
    try:
        manager = MedicationManager(cast(Any, MemoryStore()))
        await manager.async_initialize()
        await manager.async_add_medication(
            name="Morning",
            tag_id="tag-shared",
        )

        rejected = False
        try:
            await manager.async_add_medication(
                name="Evening",
                tag_id="tag-shared",
            )
        except MedicationValidationError:
            rejected = True

        assert rejected is True
    except Exception:
        _LOGGER.exception("Medication Manager duplicate tag flow failed")
        raise
