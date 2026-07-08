"""Tests for Medication Manager reminder scheduler helpers."""

from __future__ import annotations

from datetime import date, datetime, time, timezone
import logging
from uuid import uuid4

from custom_components.medication_manager.models import Medication, MedicationReminder
from custom_components.medication_manager.scheduler import (
    _notify_service_from_entry,
    _next_due_at,
    _reminder_still_enabled,
)

_LOGGER = logging.getLogger(__name__)


def test_next_due_at_uses_today_for_future_reminder() -> None:
    """Verify scheduler keeps a same-day reminder while it is still upcoming."""
    _LOGGER.debug("Testing Medication Manager same-day scheduler due time")
    try:
        due_at = _next_due_at(
            time(20, 0),
            datetime(2026, 7, 3, 8, 0, tzinfo=timezone.utc),
        )

        assert due_at == datetime(2026, 7, 3, 20, 0, tzinfo=timezone.utc)
    except Exception:
        _LOGGER.exception("Same-day scheduler due time test failed")
        raise


def test_next_due_at_moves_past_reminder_to_tomorrow() -> None:
    """Verify scheduler moves an elapsed reminder to the next day."""
    _LOGGER.debug("Testing Medication Manager next-day scheduler due time")
    try:
        due_at = _next_due_at(
            time(8, 0),
            datetime(2026, 7, 3, 20, 0, tzinfo=timezone.utc),
        )

        assert due_at == datetime(2026, 7, 4, 8, 0, tzinfo=timezone.utc)
    except Exception:
        _LOGGER.exception("Next-day scheduler due time test failed")
        raise


def test_reminder_still_enabled_requires_enabled_medication_and_time() -> None:
    """Verify scheduler checks the latest medication reminder state."""
    _LOGGER.debug("Testing Medication Manager scheduler enabled check")
    try:
        medication = Medication(
            id=uuid4(),
            name="Vitamin D",
            icon="mdi:pill",
            tag_id=None,
            enabled=True,
            created_at=datetime(2026, 7, 3, 8, 0, tzinfo=timezone.utc),
            updated_at=datetime(2026, 7, 3, 8, 0, tzinfo=timezone.utc),
            schedule=(MedicationReminder(time=time(8, 0), enabled=True),),
        )

        due_at = datetime(2026, 7, 3, 8, 0, tzinfo=timezone.utc)

        assert _reminder_still_enabled(medication, time(8, 0), due_at) is True
        assert _reminder_still_enabled(medication, time(20, 0), due_at) is False
    except Exception:
        _LOGGER.exception("Scheduler enabled check test failed")
        raise


def test_reminder_still_enabled_respects_course_end_date() -> None:
    """Verify scheduler stops reminders after a medication course ends."""
    _LOGGER.debug("Testing Medication Manager scheduler course end check")
    try:
        medication = Medication(
            id=uuid4(),
            name="Vitamin D",
            icon="mdi:pill",
            tag_id=None,
            enabled=True,
            created_at=datetime(2026, 7, 3, 8, 0, tzinfo=timezone.utc),
            updated_at=datetime(2026, 7, 3, 8, 0, tzinfo=timezone.utc),
            schedule=(MedicationReminder(time=time(8, 0), enabled=True),),
            course_end_date=date(2026, 7, 3),
        )

        assert (
            _reminder_still_enabled(
                medication,
                time(8, 0),
                datetime(2026, 7, 3, 8, 0, tzinfo=timezone.utc),
            )
            is True
        )
        assert (
            _reminder_still_enabled(
                medication,
                time(8, 0),
                datetime(2026, 7, 4, 8, 0, tzinfo=timezone.utc),
            )
            is False
        )
    except Exception:
        _LOGGER.exception("Scheduler course end check test failed")
        raise


def test_notify_service_normalizes_mobile_app_service() -> None:
    """Verify scheduler normalizes configured mobile app notify services."""
    _LOGGER.debug("Testing Medication Manager scheduler notify service normalization")
    try:
        entry = _Entry(
            data={"notify_service": "notify.mobile_app_phone"},
            options={},
        )

        assert _notify_service_from_entry(entry) == "mobile_app_phone"
    except Exception:
        _LOGGER.exception("Scheduler notify service normalization test failed")
        raise


class _Entry:
    """Minimal config entry object for scheduler helper tests."""

    def __init__(
        self,
        *,
        data: dict[str, object],
        options: dict[str, object],
    ) -> None:
        """Initialize the minimal config entry."""
        _LOGGER.debug("Initializing scheduler helper config entry")
        try:
            self.data = data
            self.options = options
        except Exception:
            _LOGGER.exception("Unable to initialize scheduler helper entry")
            raise
