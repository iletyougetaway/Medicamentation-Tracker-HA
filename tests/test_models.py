"""Tests for Medication Manager storage models."""

from __future__ import annotations

from datetime import date, datetime, time, timezone
import logging
from types import MappingProxyType
from uuid import uuid4

from custom_components.medication_manager.models import (
    HistoryEntry,
    HistorySource,
    HistoryStatus,
    Medication,
    MedicationManagerStoreData,
    MedicationReminder,
)

_LOGGER = logging.getLogger(__name__)


def test_storage_payload_round_trip() -> None:
    """Verify medication and history payloads serialize without data loss."""
    _LOGGER.debug("Testing Medication Manager storage model round trip")
    try:
        medication_id = uuid4()
        history_id = uuid4()
        medication = Medication(
            id=medication_id,
            name="Vitamin D",
            icon="mdi:pill",
            tag_id="tag-vitamin-d",
            enabled=True,
            created_at=datetime(2026, 7, 3, 6, 0, tzinfo=timezone.utc),
            updated_at=datetime(2026, 7, 3, 6, 5, tzinfo=timezone.utc),
            schedule=(MedicationReminder(time=time(8, 0), enabled=True),),
            course_end_date=date(2026, 7, 31),
        )
        history = HistoryEntry(
            id=history_id,
            medication_id=medication_id,
            scheduled_time=datetime(2026, 7, 3, 8, 0, tzinfo=timezone.utc),
            taken_time=datetime(2026, 7, 3, 8, 2, tzinfo=timezone.utc),
            status=HistoryStatus.LATE,
            source=HistorySource.NFC,
        )
        data = MedicationManagerStoreData(
            version=1,
            medications=MappingProxyType({medication_id: medication}),
            history=(history,),
            settings=MappingProxyType({"enabled": True}),
        )

        restored = MedicationManagerStoreData.from_storage(data.as_storage())

        assert restored.version == 1
        assert restored.medications[medication_id].name == "Vitamin D"
        assert restored.medications[medication_id].schedule[0].time == time(8, 0)
        assert restored.medications[medication_id].course_end_date == date(
            2026,
            7,
            31,
        )
        assert restored.history[0].source is HistorySource.NFC
        assert restored.history[0].status is HistoryStatus.LATE
        assert restored.settings["enabled"] is True
    except Exception:
        _LOGGER.exception("Storage model round trip test failed")
        raise


def test_invalid_storage_payload_is_rejected() -> None:
    """Verify invalid reminder times are rejected during storage parsing."""
    _LOGGER.debug("Testing Medication Manager invalid storage payload handling")
    try:
        rejected = False
        try:
            MedicationReminder.from_storage(
                {
                    "time": "08:00:30",
                    "enabled": True,
                }
            )
        except ValueError:
            rejected = True

        assert rejected is True
    except Exception:
        _LOGGER.exception("Invalid storage payload test failed")
        raise
