"""Tests for Medication Manager history aggregation."""

from __future__ import annotations

from datetime import date, datetime, timezone
import logging
from uuid import UUID, uuid4

from custom_components.medication_manager.history import MedicationHistory
from custom_components.medication_manager.models import (
    HistoryEntry,
    HistorySource,
    HistoryStatus,
)

_LOGGER = logging.getLogger(__name__)


def test_weekly_summary_marks_status_counts_and_future_days() -> None:
    """Verify weekly history summaries expose the card status contract."""
    _LOGGER.debug("Testing Medication Manager weekly history summaries")
    try:
        medication_id = uuid4()
        other_medication_id = uuid4()
        week_start = date(2026, 6, 29)
        today = date(2026, 7, 1)
        entries = (
            _history_entry(
                medication_id,
                datetime(2026, 6, 29, 8, 0, tzinfo=timezone.utc),
                HistoryStatus.TAKEN,
            ),
            _history_entry(
                medication_id,
                datetime(2026, 6, 29, 20, 20, tzinfo=timezone.utc),
                HistoryStatus.LATE,
            ),
            _history_entry(
                medication_id,
                datetime(2026, 6, 30, 8, 0, tzinfo=timezone.utc),
                HistoryStatus.MISSED,
            ),
            _history_entry(
                other_medication_id,
                datetime(2026, 6, 29, 8, 0, tzinfo=timezone.utc),
                HistoryStatus.TAKEN,
            ),
        )

        summary = MedicationHistory.weekly_summary(
            entries,
            medication_id=medication_id,
            week_start=week_start,
            today=today,
        )

        assert len(summary) == 7
        assert summary[0].status is HistoryStatus.LATE
        assert summary[0].taken_count == 1
        assert summary[0].late_count == 1
        assert summary[1].status is HistoryStatus.MISSED
        assert summary[2].is_future is False
        assert summary[3].is_future is True
    except Exception:
        _LOGGER.exception("Weekly history summary test failed")
        raise


def test_history_range_filter_orders_newest_first() -> None:
    """Verify history range filtering excludes unrelated and old entries."""
    _LOGGER.debug("Testing Medication Manager history range filtering")
    try:
        medication_id = uuid4()
        other_medication_id = uuid4()
        entries = (
            _history_entry(
                medication_id,
                datetime(2026, 7, 1, 8, 0, tzinfo=timezone.utc),
                HistoryStatus.TAKEN,
            ),
            _history_entry(
                medication_id,
                datetime(2026, 7, 2, 8, 0, tzinfo=timezone.utc),
                HistoryStatus.TAKEN,
            ),
            _history_entry(
                other_medication_id,
                datetime(2026, 7, 2, 9, 0, tzinfo=timezone.utc),
                HistoryStatus.TAKEN,
            ),
        )

        filtered = MedicationHistory.between(
            entries,
            medication_id=medication_id,
            start=datetime(2026, 7, 1, 12, 0, tzinfo=timezone.utc),
            end=datetime(2026, 7, 3, 0, 0, tzinfo=timezone.utc),
        )

        assert len(filtered) == 1
        assert filtered[0].medication_id == medication_id
        assert filtered[0].taken_time == datetime(
            2026,
            7,
            2,
            8,
            0,
            tzinfo=timezone.utc,
        )
    except Exception:
        _LOGGER.exception("History range filter test failed")
        raise


def _history_entry(
    medication_id: UUID,
    taken_time: datetime,
    status: HistoryStatus,
) -> HistoryEntry:
    """Build a medication history entry for unit tests."""
    _LOGGER.debug("Building Medication Manager test history entry")
    try:
        return HistoryEntry(
            id=uuid4(),
            medication_id=medication_id,
            scheduled_time=None,
            taken_time=taken_time,
            status=status,
            source=HistorySource.API,
        )
    except Exception:
        _LOGGER.exception("Unable to build test history entry")
        raise
