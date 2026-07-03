"""Storage-backed state manager for Medication Manager."""

from __future__ import annotations

import asyncio
from collections.abc import Mapping, Sequence
from dataclasses import replace
from datetime import date, datetime, time, timezone
import logging
from types import MappingProxyType
from uuid import UUID, uuid4

from homeassistant.exceptions import HomeAssistantError

from .const import DEFAULT_MEDICATION_ICON
from .history import MedicationDayHistory, MedicationHistory
from .models import (
    HistoryEntry,
    HistorySource,
    HistoryStatus,
    Medication,
    MedicationManagerStoreData,
    MedicationReminder,
)
from .storage import MedicationManagerStore

_LOGGER = logging.getLogger(__name__)


class MedicationManagerError(HomeAssistantError):
    """Base error raised by Medication Manager domain logic."""


class MedicationNotFoundError(MedicationManagerError):
    """Raised when a medication cannot be found."""


class MedicationValidationError(MedicationManagerError):
    """Raised when medication data fails validation."""


class MedicationManager:
    """Manage Medication Manager state loaded from Home Assistant storage."""

    def __init__(self, store: MedicationManagerStore) -> None:
        """Initialize the manager with a storage backend."""
        _LOGGER.debug("Initializing Medication Manager state manager")
        try:
            self._store = store
            self._lock = asyncio.Lock()
            self._data: MedicationManagerStoreData | None = None
        except Exception as err:
            _LOGGER.exception("Failed to initialize Medication Manager state manager")
            raise HomeAssistantError(
                "Medication Manager initialization failed"
            ) from err

    async def async_initialize(self) -> None:
        """Load Medication Manager state from storage."""
        _LOGGER.debug("Loading Medication Manager state")
        try:
            async with self._lock:
                if self._data is None:
                    self._data = await self._store.async_load()
                    _LOGGER.info("Medication Manager state loaded")
                else:
                    _LOGGER.debug("Medication Manager state was already loaded")
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager state loading failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error loading Medication Manager state")
            raise HomeAssistantError("Medication Manager state loading failed") from err

    async def async_shutdown(self) -> None:
        """Release the in-memory Medication Manager state."""
        _LOGGER.debug("Shutting down Medication Manager state manager")
        try:
            async with self._lock:
                self._data = None
        except Exception as err:
            _LOGGER.exception("Medication Manager shutdown failed")
            raise HomeAssistantError("Medication Manager shutdown failed") from err

    async def async_get_snapshot(self) -> MedicationManagerStoreData:
        """Return the current immutable Medication Manager snapshot."""
        _LOGGER.debug("Reading Medication Manager state snapshot")
        try:
            async with self._lock:
                return self._require_data()
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager snapshot is unavailable")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error reading Medication Manager snapshot")
            raise HomeAssistantError("Medication Manager snapshot failed") from err

    async def async_list_medications(self) -> tuple[Medication, ...]:
        """Return all medications sorted by display name."""
        _LOGGER.debug("Listing Medication Manager medications")
        try:
            async with self._lock:
                data = self._require_data()
                return tuple(
                    sorted(
                        data.medications.values(),
                        key=lambda medication: medication.name.casefold(),
                    )
                )
        except HomeAssistantError:
            _LOGGER.exception("Unable to list Medication Manager medications")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error listing medications")
            raise MedicationManagerError("Medication listing failed") from err

    async def async_get_medication(self, medication_id: UUID | str) -> Medication:
        """Return a single medication by id."""
        _LOGGER.debug("Reading Medication Manager medication %s", medication_id)
        try:
            async with self._lock:
                data = self._require_data()
                return _get_medication(
                    data.medications,
                    _coerce_medication_id(medication_id),
                )
        except HomeAssistantError:
            _LOGGER.exception("Unable to read Medication Manager medication")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error reading medication %s", medication_id)
            raise MedicationManagerError("Medication read failed") from err

    async def async_find_medication_by_tag(self, tag_id: str) -> Medication | None:
        """Return the medication bound to an NFC tag id."""
        _LOGGER.debug("Finding Medication Manager medication for tag %s", tag_id)
        try:
            normalized_tag_id = _normalize_optional_text(tag_id, "tag_id")
            if normalized_tag_id is None:
                raise MedicationValidationError("NFC tag id must not be empty")

            async with self._lock:
                data = self._require_data()
                for medication in data.medications.values():
                    if medication.tag_id == normalized_tag_id:
                        return medication
                return None
        except HomeAssistantError:
            _LOGGER.exception("Unable to find Medication Manager medication by tag")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error finding medication by tag")
            raise MedicationManagerError("Medication tag lookup failed") from err

    async def async_list_history(
        self,
        *,
        medication_id: UUID | str | None = None,
        start: datetime | None = None,
        end: datetime | None = None,
        limit: int | None = None,
    ) -> tuple[HistoryEntry, ...]:
        """Return history entries filtered by medication and datetime range."""
        _LOGGER.debug("Listing Medication Manager history")
        try:
            parsed_medication_id = (
                _coerce_medication_id(medication_id)
                if medication_id is not None
                else None
            )
            normalized_start = _normalize_optional_datetime(start, "start")
            normalized_end = _normalize_optional_datetime(end, "end")
            _validate_history_range(normalized_start, normalized_end)
            normalized_limit = _normalize_history_limit(limit)

            async with self._lock:
                data = self._require_data()
                entries = MedicationHistory.between(
                    data.history,
                    medication_id=parsed_medication_id,
                    start=normalized_start,
                    end=normalized_end,
                )
                if normalized_limit is None:
                    return entries
                return entries[:normalized_limit]
        except HomeAssistantError:
            _LOGGER.exception("Unable to list Medication Manager history")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error listing Medication Manager history")
            raise MedicationManagerError("History listing failed") from err

    async def async_latest_history(
        self,
        medication_id: UUID | str,
    ) -> HistoryEntry | None:
        """Return the latest history entry for a medication."""
        _LOGGER.debug(
            "Reading latest Medication Manager history for medication %s",
            medication_id,
        )
        try:
            parsed_medication_id = _coerce_medication_id(medication_id)
            async with self._lock:
                data = self._require_data()
                _get_medication(data.medications, parsed_medication_id)
                return MedicationHistory.latest_for_medication(
                    data.history,
                    parsed_medication_id,
                )
        except HomeAssistantError:
            _LOGGER.exception("Unable to read latest Medication Manager history")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error reading latest history")
            raise MedicationManagerError("Latest history lookup failed") from err

    async def async_weekly_history(
        self,
        medication_id: UUID | str,
        *,
        week_start: date,
        today: date,
    ) -> tuple[MedicationDayHistory, ...]:
        """Return seven day summaries for a medication week."""
        _LOGGER.debug(
            "Reading weekly Medication Manager history for medication %s",
            medication_id,
        )
        try:
            parsed_medication_id = _coerce_medication_id(medication_id)
            async with self._lock:
                data = self._require_data()
                _get_medication(data.medications, parsed_medication_id)
                return MedicationHistory.weekly_summary(
                    data.history,
                    medication_id=parsed_medication_id,
                    week_start=week_start,
                    today=today,
                )
        except HomeAssistantError:
            _LOGGER.exception("Unable to read weekly Medication Manager history")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error reading weekly history")
            raise MedicationManagerError("Weekly history lookup failed") from err

    async def async_add_medication(
        self,
        *,
        name: str,
        icon: str = DEFAULT_MEDICATION_ICON,
        tag_id: str | None = None,
        enabled: bool = True,
        reminders: Sequence[MedicationReminder] = (),
    ) -> Medication:
        """Create and persist a new medication."""
        _LOGGER.debug("Adding Medication Manager medication")
        try:
            normalized_name = _normalize_text(name, "name")
            normalized_icon = _normalize_icon(icon)
            normalized_tag_id = _normalize_optional_text(tag_id, "tag_id")
            normalized_reminders = _normalize_reminders(reminders)
            now = datetime.now(timezone.utc)

            async with self._lock:
                data = self._require_data()
                medications = dict(data.medications)
                _ensure_tag_available(medications, normalized_tag_id)

                medication = Medication(
                    id=uuid4(),
                    name=normalized_name,
                    icon=normalized_icon,
                    tag_id=normalized_tag_id,
                    enabled=enabled,
                    created_at=now,
                    updated_at=now,
                    schedule=normalized_reminders,
                )
                medications[medication.id] = medication
                await self._async_store_locked(_with_medications(data, medications))
                _LOGGER.info("Added Medication Manager medication %s", medication.id)
                return medication
        except HomeAssistantError:
            _LOGGER.exception("Unable to add Medication Manager medication")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error adding medication")
            raise MedicationManagerError("Medication creation failed") from err

    async def async_update_medication(
        self,
        medication_id: UUID | str,
        *,
        name: str | None = None,
        icon: str | None = None,
        tag_id: str | None = None,
        clear_tag: bool = False,
        enabled: bool | None = None,
        reminders: Sequence[MedicationReminder] | None = None,
    ) -> Medication:
        """Update and persist an existing medication."""
        _LOGGER.debug("Updating Medication Manager medication %s", medication_id)
        try:
            parsed_medication_id = _coerce_medication_id(medication_id)

            async with self._lock:
                data = self._require_data()
                medications = dict(data.medications)
                current = _get_medication(medications, parsed_medication_id)
                next_tag_id = _resolve_updated_tag_id(
                    current=current,
                    tag_id=tag_id,
                    clear_tag=clear_tag,
                )
                _ensure_tag_available(
                    medications,
                    next_tag_id,
                    excluded_medication_id=current.id,
                )

                updated = replace(
                    current,
                    name=(
                        _normalize_text(name, "name")
                        if name is not None
                        else current.name
                    ),
                    icon=_normalize_icon(icon) if icon is not None else current.icon,
                    tag_id=next_tag_id,
                    enabled=enabled if enabled is not None else current.enabled,
                    updated_at=datetime.now(timezone.utc),
                    schedule=(
                        _normalize_reminders(reminders)
                        if reminders is not None
                        else current.schedule
                    ),
                )
                medications[updated.id] = updated
                await self._async_store_locked(_with_medications(data, medications))
                _LOGGER.info("Updated Medication Manager medication %s", updated.id)
                return updated
        except HomeAssistantError:
            _LOGGER.exception(
                "Unable to update Medication Manager medication %s",
                medication_id,
            )
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error updating medication %s", medication_id)
            raise MedicationManagerError("Medication update failed") from err

    async def async_delete_medication(self, medication_id: UUID | str) -> Medication:
        """Delete and persist an existing medication."""
        _LOGGER.debug("Deleting Medication Manager medication %s", medication_id)
        try:
            parsed_medication_id = _coerce_medication_id(medication_id)

            async with self._lock:
                data = self._require_data()
                medications = dict(data.medications)
                medication = _get_medication(medications, parsed_medication_id)
                del medications[medication.id]
                await self._async_store_locked(_with_medications(data, medications))
                _LOGGER.info("Deleted Medication Manager medication %s", medication.id)
                return medication
        except HomeAssistantError:
            _LOGGER.exception(
                "Unable to delete Medication Manager medication %s",
                medication_id,
            )
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error deleting medication %s", medication_id)
            raise MedicationManagerError("Medication deletion failed") from err

    async def async_bind_tag(
        self,
        medication_id: UUID | str,
        *,
        tag_id: str,
    ) -> Medication:
        """Bind an NFC tag id to an existing medication."""
        _LOGGER.debug(
            "Binding tag to Medication Manager medication %s",
            medication_id,
        )
        try:
            return await self.async_update_medication(
                medication_id,
                tag_id=tag_id,
                clear_tag=False,
            )
        except HomeAssistantError:
            _LOGGER.exception(
                "Unable to bind tag to Medication Manager medication %s",
                medication_id,
            )
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error binding tag to medication")
            raise MedicationManagerError("Medication tag binding failed") from err

    async def async_record_history_entry(
        self,
        medication_id: UUID | str,
        *,
        scheduled_time: datetime | None,
        taken_time: datetime | None,
        status: HistoryStatus | str,
        source: HistorySource | str,
    ) -> HistoryEntry:
        """Create and persist an independent medication history entry."""
        _LOGGER.debug(
            "Recording Medication Manager history for medication %s",
            medication_id,
        )
        try:
            parsed_medication_id = _coerce_medication_id(medication_id)
            normalized_scheduled_time = _normalize_optional_datetime(
                scheduled_time,
                "scheduled_time",
            )
            normalized_taken_time = _normalize_taken_time(taken_time)
            normalized_status = _normalize_history_status(status)
            normalized_source = _normalize_history_source(source)

            async with self._lock:
                data = self._require_data()
                _get_medication(data.medications, parsed_medication_id)
                entry = HistoryEntry(
                    id=uuid4(),
                    medication_id=parsed_medication_id,
                    scheduled_time=normalized_scheduled_time,
                    taken_time=normalized_taken_time,
                    status=normalized_status,
                    source=normalized_source,
                )
                history = (*data.history, entry)
                await self._async_store_locked(_with_history(data, history))
                _LOGGER.info(
                    "Recorded Medication Manager history entry %s",
                    entry.id,
                )
                return entry
        except HomeAssistantError:
            _LOGGER.exception(
                "Unable to record Medication Manager history for medication %s",
                medication_id,
            )
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error recording Medication Manager history")
            raise MedicationManagerError("History recording failed") from err

    async def async_take_medication(
        self,
        medication_id: UUID | str,
        *,
        scheduled_time: datetime | None = None,
        taken_time: datetime | None = None,
        source: HistorySource | str = HistorySource.API,
        status: HistoryStatus | str | None = None,
    ) -> HistoryEntry:
        """Record a medication intake history entry."""
        _LOGGER.debug(
            "Taking Medication Manager medication %s",
            medication_id,
        )
        try:
            normalized_taken_time = _normalize_taken_time(taken_time)
            normalized_scheduled_time = _normalize_optional_datetime(
                scheduled_time,
                "scheduled_time",
            )
            resolved_status = _resolve_take_status(
                status=status,
                scheduled_time=normalized_scheduled_time,
                taken_time=normalized_taken_time,
            )
            return await self.async_record_history_entry(
                medication_id,
                scheduled_time=normalized_scheduled_time,
                taken_time=normalized_taken_time,
                status=resolved_status,
                source=source,
            )
        except HomeAssistantError:
            _LOGGER.exception(
                "Unable to take Medication Manager medication %s",
                medication_id,
            )
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error taking Medication Manager medication")
            raise MedicationManagerError("Medication intake recording failed") from err

    async def async_replace_data(
        self,
        data: MedicationManagerStoreData,
    ) -> MedicationManagerStoreData:
        """Persist and publish a complete Medication Manager state replacement."""
        _LOGGER.debug("Persisting Medication Manager state replacement")
        try:
            async with self._lock:
                await self._store.async_save(data)
                self._data = data
                return data
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager state replacement failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected error replacing Medication Manager state")
            raise HomeAssistantError(
                "Medication Manager state replacement failed"
            ) from err

    def _require_data(self) -> MedicationManagerStoreData:
        """Return loaded data or raise a Home Assistant error."""
        _LOGGER.debug("Validating loaded Medication Manager state")
        try:
            if self._data is None:
                raise HomeAssistantError("Medication Manager state is not loaded")
            return self._data
        except HomeAssistantError:
            raise
        except Exception as err:
            _LOGGER.exception("Medication Manager state validation failed")
            raise HomeAssistantError(
                "Medication Manager state validation failed"
            ) from err

    async def _async_store_locked(self, data: MedicationManagerStoreData) -> None:
        """Persist state while the manager lock is already held."""
        _LOGGER.debug("Persisting Medication Manager state")
        try:
            await self._store.async_save(data)
            self._data = data
        except HomeAssistantError:
            _LOGGER.exception("Medication Manager state persistence failed")
            raise
        except Exception as err:
            _LOGGER.exception("Unexpected Medication Manager persistence error")
            raise MedicationManagerError(
                "Medication Manager persistence failed"
            ) from err


def _with_medications(
    data: MedicationManagerStoreData,
    medications: Mapping[UUID, Medication],
) -> MedicationManagerStoreData:
    """Return a new immutable store payload with replaced medications."""
    _LOGGER.debug("Building Medication Manager data with updated medications")
    try:
        return MedicationManagerStoreData(
            version=data.version,
            medications=MappingProxyType(dict(medications)),
            history=data.history,
            settings=data.settings,
        )
    except Exception as err:
        _LOGGER.exception("Unable to build updated Medication Manager data")
        raise MedicationManagerError("Medication Manager data update failed") from err


def _with_history(
    data: MedicationManagerStoreData,
    history: tuple[HistoryEntry, ...],
) -> MedicationManagerStoreData:
    """Return a new immutable store payload with replaced history."""
    _LOGGER.debug("Building Medication Manager data with updated history")
    try:
        return MedicationManagerStoreData(
            version=data.version,
            medications=data.medications,
            history=history,
            settings=data.settings,
        )
    except Exception as err:
        _LOGGER.exception("Unable to build updated Medication Manager history data")
        raise MedicationManagerError(
            "Medication Manager history update failed"
        ) from err


def _get_medication(
    medications: Mapping[UUID, Medication],
    medication_id: UUID,
) -> Medication:
    """Return a medication from a mapping or raise a domain error."""
    _LOGGER.debug("Looking up Medication Manager medication %s", medication_id)
    try:
        medication = medications.get(medication_id)
        if medication is None:
            raise MedicationNotFoundError(f"Medication {medication_id} was not found")
        return medication
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication lookup failed for %s", medication_id)
        raise MedicationManagerError("Medication lookup failed") from err


def _coerce_medication_id(value: UUID | str) -> UUID:
    """Parse a medication id into a UUID."""
    _LOGGER.debug("Parsing Medication Manager medication id %s", value)
    try:
        return value if isinstance(value, UUID) else UUID(value)
    except Exception as err:
        _LOGGER.exception("Invalid Medication Manager medication id %s", value)
        raise MedicationValidationError("Medication id must be a valid UUID") from err


def _normalize_text(value: str, field: str) -> str:
    """Normalize a required non-empty text field."""
    _LOGGER.debug("Normalizing Medication Manager field %s", field)
    try:
        normalized = value.strip()
        if not normalized:
            raise MedicationValidationError(f"{field} must not be empty")
        return normalized
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Invalid Medication Manager text field %s", field)
        raise MedicationValidationError(f"{field} is invalid") from err


def _normalize_optional_text(value: str | None, field: str) -> str | None:
    """Normalize an optional text field and convert empty text to null."""
    _LOGGER.debug("Normalizing optional Medication Manager field %s", field)
    try:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None
    except Exception as err:
        _LOGGER.exception("Invalid optional Medication Manager text field %s", field)
        raise MedicationValidationError(f"{field} is invalid") from err


def _normalize_icon(value: str) -> str:
    """Normalize a medication icon value."""
    _LOGGER.debug("Normalizing Medication Manager icon")
    try:
        normalized = value.strip()
        return normalized or DEFAULT_MEDICATION_ICON
    except Exception as err:
        _LOGGER.exception("Invalid Medication Manager icon")
        raise MedicationValidationError("icon is invalid") from err


def _normalize_reminders(
    reminders: Sequence[MedicationReminder],
) -> tuple[MedicationReminder, ...]:
    """Validate, de-duplicate, and sort medication reminders."""
    _LOGGER.debug("Normalizing Medication Manager reminders")
    try:
        normalized: list[MedicationReminder] = []
        seen_times: set[time] = set()

        for reminder in reminders:
            _validate_reminder_time(reminder.time)
            if reminder.time in seen_times:
                raise MedicationValidationError(
                    f"Duplicate reminder time {reminder.time.strftime('%H:%M')}"
                )
            seen_times.add(reminder.time)
            normalized.append(reminder)

        return tuple(sorted(normalized, key=lambda reminder: reminder.time))
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Invalid Medication Manager reminder schedule")
        raise MedicationValidationError("Reminder schedule is invalid") from err


def _validate_reminder_time(reminder_time: time) -> None:
    """Validate that a reminder uses local HH:MM precision."""
    _LOGGER.debug("Validating Medication Manager reminder time")
    try:
        if (
            reminder_time.tzinfo is not None
            or reminder_time.second
            or reminder_time.microsecond
        ):
            raise MedicationValidationError("Reminder time must use HH:MM format")
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Invalid Medication Manager reminder time")
        raise MedicationValidationError("Reminder time is invalid") from err


def _ensure_tag_available(
    medications: Mapping[UUID, Medication],
    tag_id: str | None,
    *,
    excluded_medication_id: UUID | None = None,
) -> None:
    """Ensure an NFC tag is not already bound to another medication."""
    _LOGGER.debug("Checking Medication Manager tag availability")
    try:
        if tag_id is None:
            return

        for medication in medications.values():
            if medication.id == excluded_medication_id:
                continue
            if medication.tag_id == tag_id:
                raise MedicationValidationError(
                    f"NFC tag is already bound to medication {medication.id}"
                )
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager tag availability check failed")
        raise MedicationValidationError("NFC tag availability check failed") from err


def _resolve_updated_tag_id(
    *,
    current: Medication,
    tag_id: str | None,
    clear_tag: bool,
) -> str | None:
    """Resolve the next tag id during medication updates."""
    _LOGGER.debug("Resolving updated Medication Manager tag id")
    try:
        if clear_tag and tag_id is not None:
            raise MedicationValidationError(
                "tag_id and clear_tag must not be used together"
            )
        if clear_tag:
            return None
        if tag_id is not None:
            return _normalize_optional_text(tag_id, "tag_id")
        return current.tag_id
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager tag update resolution failed")
        raise MedicationValidationError("NFC tag update is invalid") from err


def _normalize_taken_time(value: datetime | None) -> datetime:
    """Return a normalized taken time, defaulting to current UTC time."""
    _LOGGER.debug("Normalizing Medication Manager taken time")
    try:
        if value is None:
            return datetime.now(timezone.utc)
        return _normalize_datetime(value, "taken_time")
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager taken time normalization failed")
        raise MedicationValidationError("taken_time is invalid") from err


def _normalize_optional_datetime(
    value: datetime | None,
    field: str,
) -> datetime | None:
    """Normalize an optional aware datetime to UTC."""
    _LOGGER.debug("Normalizing optional Medication Manager datetime %s", field)
    try:
        if value is None:
            return None
        return _normalize_datetime(value, field)
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager optional datetime normalization failed")
        raise MedicationValidationError(f"{field} is invalid") from err


def _normalize_datetime(value: datetime, field: str) -> datetime:
    """Normalize an aware datetime to UTC."""
    _LOGGER.debug("Normalizing Medication Manager datetime %s", field)
    try:
        if value.tzinfo is None:
            raise MedicationValidationError(f"{field} must include timezone")
        return value.astimezone(timezone.utc)
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager datetime normalization failed")
        raise MedicationValidationError(f"{field} is invalid") from err


def _normalize_history_status(value: HistoryStatus | str) -> HistoryStatus:
    """Normalize a history status value."""
    _LOGGER.debug("Normalizing Medication Manager history status")
    try:
        return value if isinstance(value, HistoryStatus) else HistoryStatus(value)
    except Exception as err:
        _LOGGER.exception("Medication Manager history status is invalid")
        raise MedicationValidationError("status is invalid") from err


def _normalize_history_source(value: HistorySource | str) -> HistorySource:
    """Normalize a history source value."""
    _LOGGER.debug("Normalizing Medication Manager history source")
    try:
        return value if isinstance(value, HistorySource) else HistorySource(value)
    except Exception as err:
        _LOGGER.exception("Medication Manager history source is invalid")
        raise MedicationValidationError("source is invalid") from err


def _resolve_take_status(
    *,
    status: HistoryStatus | str | None,
    scheduled_time: datetime | None,
    taken_time: datetime,
) -> HistoryStatus:
    """Resolve the history status for a medication intake."""
    _LOGGER.debug("Resolving Medication Manager intake status")
    try:
        if status is not None:
            normalized_status = _normalize_history_status(status)
            if normalized_status is HistoryStatus.MISSED:
                raise MedicationValidationError(
                    "take_medication cannot create missed history"
                )
            return normalized_status
        if scheduled_time is not None and taken_time > scheduled_time:
            return HistoryStatus.LATE
        return HistoryStatus.TAKEN
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager intake status resolution failed")
        raise MedicationValidationError("status is invalid") from err


def _validate_history_range(
    start: datetime | None,
    end: datetime | None,
) -> None:
    """Validate a history datetime range."""
    _LOGGER.debug("Validating Medication Manager history range")
    try:
        if start is not None and end is not None and start >= end:
            raise MedicationValidationError("start must be before end")
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager history range is invalid")
        raise MedicationValidationError("History range is invalid") from err


def _normalize_history_limit(limit: int | None) -> int | None:
    """Normalize an optional history result limit."""
    _LOGGER.debug("Normalizing Medication Manager history limit")
    try:
        if limit is None:
            return None
        if limit <= 0:
            raise MedicationValidationError("limit must be greater than zero")
        return limit
    except HomeAssistantError:
        raise
    except Exception as err:
        _LOGGER.exception("Medication Manager history limit is invalid")
        raise MedicationValidationError("limit is invalid") from err
