"""History helpers for Medication Manager."""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date, datetime, timedelta
import logging
from uuid import UUID

from homeassistant.exceptions import HomeAssistantError

from .models import HistoryEntry, HistoryStatus

_LOGGER = logging.getLogger(__name__)


class MedicationHistoryError(HomeAssistantError):
    """Raised when Medication Manager history processing fails."""


@dataclass(frozen=True, slots=True)
class MedicationDayHistory:
    """History summary for one medication on one calendar day."""

    medication_id: UUID
    day: date
    status: HistoryStatus | None
    entry_ids: tuple[UUID, ...]
    taken_count: int
    late_count: int
    missed_count: int
    is_future: bool


class MedicationHistory:
    """Pure history query and aggregation engine."""

    @staticmethod
    def ordered(entries: Iterable[HistoryEntry]) -> tuple[HistoryEntry, ...]:
        """Return history entries ordered by newest taken time first."""
        _LOGGER.debug("Ordering Medication Manager history entries")
        try:
            return tuple(
                sorted(
                    entries,
                    key=lambda entry: entry.taken_time,
                    reverse=True,
                )
            )
        except Exception as err:
            _LOGGER.exception("Medication Manager history ordering failed")
            raise MedicationHistoryError("History ordering failed") from err

    @staticmethod
    def for_medication(
        entries: Iterable[HistoryEntry],
        medication_id: UUID,
    ) -> tuple[HistoryEntry, ...]:
        """Return ordered history entries for one medication."""
        _LOGGER.debug(
            "Filtering Medication Manager history for medication %s",
            medication_id,
        )
        try:
            return MedicationHistory.ordered(
                entry for entry in entries if entry.medication_id == medication_id
            )
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager medication history filtering failed")
            raise MedicationHistoryError("Medication history filtering failed") from err

    @staticmethod
    def between(
        entries: Iterable[HistoryEntry],
        *,
        start: datetime | None = None,
        end: datetime | None = None,
        medication_id: UUID | None = None,
    ) -> tuple[HistoryEntry, ...]:
        """Return ordered history entries inside an optional datetime range."""
        _LOGGER.debug("Filtering Medication Manager history by datetime range")
        try:
            filtered = entries
            if medication_id is not None:
                filtered = (
                    entry for entry in filtered if entry.medication_id == medication_id
                )
            if start is not None:
                filtered = (entry for entry in filtered if entry.taken_time >= start)
            if end is not None:
                filtered = (entry for entry in filtered if entry.taken_time < end)
            return MedicationHistory.ordered(filtered)
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager history range filtering failed")
            raise MedicationHistoryError("History range filtering failed") from err

    @staticmethod
    def latest_for_medication(
        entries: Iterable[HistoryEntry],
        medication_id: UUID,
    ) -> HistoryEntry | None:
        """Return the latest history entry for one medication."""
        _LOGGER.debug(
            "Reading latest Medication Manager history for medication %s",
            medication_id,
        )
        try:
            ordered_entries = MedicationHistory.for_medication(entries, medication_id)
            return ordered_entries[0] if ordered_entries else None
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager latest history lookup failed")
            raise MedicationHistoryError("Latest history lookup failed") from err

    @staticmethod
    def weekly_summary(
        entries: Iterable[HistoryEntry],
        *,
        medication_id: UUID,
        week_start: date,
        today: date,
    ) -> tuple[MedicationDayHistory, ...]:
        """Return seven daily summaries for a medication week."""
        _LOGGER.debug(
            "Building Medication Manager weekly history for medication %s",
            medication_id,
        )
        try:
            week_days = tuple(
                week_start + timedelta(days=offset) for offset in range(7)
            )
            entries_by_day: dict[date, list[HistoryEntry]] = defaultdict(list)

            for entry in entries:
                if entry.medication_id != medication_id:
                    continue
                entry_day = entry.taken_time.date()
                if entry_day in week_days:
                    entries_by_day[entry_day].append(entry)

            return tuple(
                _summarize_day(
                    medication_id=medication_id,
                    day=day,
                    entries=entries_by_day.get(day, []),
                    today=today,
                )
                for day in week_days
            )
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager weekly history failed")
            raise MedicationHistoryError("Weekly history failed") from err


def _summarize_day(
    *,
    medication_id: UUID,
    day: date,
    entries: Iterable[HistoryEntry],
    today: date,
) -> MedicationDayHistory:
    """Build a daily medication history summary."""
    _LOGGER.debug(
        "Summarizing Medication Manager history for medication %s on %s",
        medication_id,
        day,
    )
    try:
        day_entries = MedicationHistory.ordered(entries)
        taken_count = _count_status(day_entries, HistoryStatus.TAKEN)
        late_count = _count_status(day_entries, HistoryStatus.LATE)
        missed_count = _count_status(day_entries, HistoryStatus.MISSED)
        return MedicationDayHistory(
            medication_id=medication_id,
            day=day,
            status=_dominant_status(day_entries),
            entry_ids=tuple(entry.id for entry in day_entries),
            taken_count=taken_count,
            late_count=late_count,
            missed_count=missed_count,
            is_future=day > today,
        )
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager daily history summary failed")
        raise MedicationHistoryError("Daily history summary failed") from err


def _dominant_status(entries: Iterable[HistoryEntry]) -> HistoryStatus | None:
    """Return the display status for a daily history summary."""
    _LOGGER.debug("Resolving Medication Manager dominant daily history status")
    try:
        statuses = tuple(entry.status for entry in entries)
        if HistoryStatus.LATE in statuses:
            return HistoryStatus.LATE
        if HistoryStatus.TAKEN in statuses:
            return HistoryStatus.TAKEN
        if HistoryStatus.MISSED in statuses:
            return HistoryStatus.MISSED
        return None
    except Exception as err:
        _LOGGER.exception("Medication Manager dominant status resolution failed")
        raise MedicationHistoryError("Dominant status resolution failed") from err


def _count_status(entries: Iterable[HistoryEntry], status: HistoryStatus) -> int:
    """Count history entries matching one status."""
    _LOGGER.debug("Counting Medication Manager history entries with status %s", status)
    try:
        return sum(1 for entry in entries if entry.status == status)
    except Exception as err:
        _LOGGER.exception("Medication Manager history status counting failed")
        raise MedicationHistoryError("History status counting failed") from err
