"""Typed storage models for Medication Manager."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from datetime import datetime, time, timezone
from enum import StrEnum
import logging
from types import MappingProxyType
from typing import TypeAlias, cast
from uuid import UUID

_LOGGER = logging.getLogger(__name__)

JsonValue: TypeAlias = (
    str
    | int
    | float
    | bool
    | None
    | dict[str, "JsonValue"]
    | list["JsonValue"]
)
JsonObject: TypeAlias = dict[str, JsonValue]


class HistorySource(StrEnum):
    """Source that created a medication history entry."""

    NFC = "nfc"
    BUTTON = "button"
    NOTIFICATION = "notification"
    API = "api"


class HistoryStatus(StrEnum):
    """Medication intake status."""

    TAKEN = "taken"
    MISSED = "missed"
    LATE = "late"


@dataclass(frozen=True, slots=True)
class MedicationReminder:
    """A single time-of-day reminder for a medication."""

    time: time
    enabled: bool = True

    @classmethod
    def from_storage(cls, value: object) -> MedicationReminder:
        """Create a reminder from a storage object."""
        _LOGGER.debug("Parsing medication reminder from storage")
        try:
            data = _as_mapping(value, "reminder")
            return cls(
                time=_parse_reminder_time(_required_str(data, "time")),
                enabled=_optional_bool(data, "enabled", default=True),
            )
        except Exception as err:
            _LOGGER.exception("Invalid medication reminder payload")
            raise ValueError("Invalid medication reminder payload") from err

    def as_storage(self) -> JsonObject:
        """Serialize the reminder to Home Assistant storage."""
        _LOGGER.debug("Serializing medication reminder")
        try:
            return {
                "time": _format_reminder_time(self.time),
                "enabled": self.enabled,
            }
        except Exception as err:
            _LOGGER.exception("Medication reminder serialization failed")
            raise ValueError("Medication reminder serialization failed") from err


@dataclass(frozen=True, slots=True)
class Medication:
    """A medication tracked by Medication Manager."""

    id: UUID
    name: str
    icon: str
    tag_id: str | None
    enabled: bool
    created_at: datetime
    updated_at: datetime
    schedule: tuple[MedicationReminder, ...]

    @classmethod
    def from_storage(cls, value: object) -> Medication:
        """Create a medication from a storage object."""
        _LOGGER.debug("Parsing medication from storage")
        try:
            data = _as_mapping(value, "medication")
            schedule_value = _optional_sequence(data, "schedule")
            return cls(
                id=_parse_uuid(_required_str(data, "id"), "id"),
                name=_validate_non_empty(_required_str(data, "name"), "name"),
                icon=_validate_non_empty(_required_str(data, "icon"), "icon"),
                tag_id=_optional_str(data, "tag_id"),
                enabled=_optional_bool(data, "enabled", default=True),
                created_at=_parse_datetime(_required_str(data, "created_at")),
                updated_at=_parse_datetime(_required_str(data, "updated_at")),
                schedule=tuple(
                    MedicationReminder.from_storage(item) for item in schedule_value
                ),
            )
        except Exception as err:
            _LOGGER.exception("Invalid medication payload")
            raise ValueError("Invalid medication payload") from err

    def as_storage(self) -> JsonObject:
        """Serialize the medication to Home Assistant storage."""
        _LOGGER.debug("Serializing medication %s", self.id)
        try:
            return {
                "id": str(self.id),
                "name": self.name,
                "icon": self.icon,
                "tag_id": self.tag_id,
                "enabled": self.enabled,
                "created_at": _format_datetime(self.created_at),
                "updated_at": _format_datetime(self.updated_at),
                "schedule": [reminder.as_storage() for reminder in self.schedule],
            }
        except Exception as err:
            _LOGGER.exception("Medication serialization failed for %s", self.id)
            raise ValueError("Medication serialization failed") from err


@dataclass(frozen=True, slots=True)
class HistoryEntry:
    """A single medication history entry."""

    id: UUID
    medication_id: UUID
    scheduled_time: datetime | None
    taken_time: datetime
    status: HistoryStatus
    source: HistorySource

    @classmethod
    def from_storage(cls, value: object) -> HistoryEntry:
        """Create a history entry from a storage object."""
        _LOGGER.debug("Parsing medication history entry from storage")
        try:
            data = _as_mapping(value, "history entry")
            return cls(
                id=_parse_uuid(_required_str(data, "id"), "id"),
                medication_id=_parse_uuid(
                    _required_str(data, "medication_id"),
                    "medication_id",
                ),
                scheduled_time=_optional_datetime(data, "scheduled_time"),
                taken_time=_parse_datetime(_required_str(data, "taken_time")),
                status=HistoryStatus(_required_str(data, "status")),
                source=HistorySource(_required_str(data, "source")),
            )
        except Exception as err:
            _LOGGER.exception("Invalid medication history payload")
            raise ValueError("Invalid medication history payload") from err

    def as_storage(self) -> JsonObject:
        """Serialize the history entry to Home Assistant storage."""
        _LOGGER.debug("Serializing medication history entry %s", self.id)
        try:
            return {
                "id": str(self.id),
                "medication_id": str(self.medication_id),
                "scheduled_time": (
                    _format_datetime(self.scheduled_time)
                    if self.scheduled_time is not None
                    else None
                ),
                "taken_time": _format_datetime(self.taken_time),
                "status": self.status.value,
                "source": self.source.value,
            }
        except Exception as err:
            _LOGGER.exception("History serialization failed for %s", self.id)
            raise ValueError("History serialization failed") from err


@dataclass(frozen=True, slots=True)
class MedicationManagerStoreData:
    """Complete Medication Manager storage payload."""

    version: int
    medications: Mapping[UUID, Medication]
    history: tuple[HistoryEntry, ...]
    settings: Mapping[str, JsonValue]

    @classmethod
    def empty(cls, version: int) -> MedicationManagerStoreData:
        """Create an empty storage payload for a new installation."""
        _LOGGER.debug("Creating empty Medication Manager storage payload")
        try:
            return cls(
                version=version,
                medications=MappingProxyType({}),
                history=(),
                settings=MappingProxyType({}),
            )
        except Exception as err:
            _LOGGER.exception("Unable to create empty storage payload")
            raise ValueError("Unable to create empty storage payload") from err

    @classmethod
    def from_storage(cls, value: object) -> MedicationManagerStoreData:
        """Create a complete storage payload from Home Assistant storage."""
        _LOGGER.debug("Parsing Medication Manager storage payload")
        try:
            data = _as_mapping(value, "storage payload")
            medications = _parse_medications(data)
            return cls(
                version=_required_int(data, "version"),
                medications=MappingProxyType(medications),
                history=tuple(
                    HistoryEntry.from_storage(item)
                    for item in _optional_sequence(data, "history")
                ),
                settings=MappingProxyType(dict(_optional_mapping(data, "settings"))),
            )
        except Exception as err:
            _LOGGER.exception("Invalid Medication Manager storage payload")
            raise ValueError("Invalid Medication Manager storage payload") from err

    def as_storage(self) -> JsonObject:
        """Serialize the complete payload to Home Assistant storage."""
        _LOGGER.debug("Serializing Medication Manager storage payload")
        try:
            return {
                "version": self.version,
                "medications": {
                    str(medication_id): medication.as_storage()
                    for medication_id, medication in self.medications.items()
                },
                "history": [entry.as_storage() for entry in self.history],
                "settings": dict(self.settings),
            }
        except Exception as err:
            _LOGGER.exception("Storage payload serialization failed")
            raise ValueError("Storage payload serialization failed") from err


def _parse_medications(data: Mapping[str, object]) -> dict[UUID, Medication]:
    """Parse the medication mapping from the root storage payload."""
    _LOGGER.debug("Parsing medication collection")
    try:
        medication_map = _optional_mapping(data, "medications")
        medications: dict[UUID, Medication] = {}
        for medication_id, medication_payload in medication_map.items():
            parsed_id = _parse_uuid(medication_id, "medication key")
            medication = Medication.from_storage(medication_payload)
            if medication.id != parsed_id:
                raise ValueError("Medication key does not match medication id")
            medications[parsed_id] = medication
        return medications
    except Exception as err:
        _LOGGER.exception("Medication collection parsing failed")
        raise ValueError("Medication collection parsing failed") from err


def _as_mapping(value: object, field: str) -> Mapping[str, object]:
    """Return a string-keyed mapping from a storage value."""
    _LOGGER.debug("Validating mapping for %s", field)
    try:
        if not isinstance(value, Mapping):
            raise TypeError(f"{field} must be an object")
        if not all(isinstance(key, str) for key in value):
            raise TypeError(f"{field} must only contain string keys")
        return cast(Mapping[str, object], value)
    except Exception as err:
        _LOGGER.exception("Invalid mapping for %s", field)
        raise ValueError(f"Invalid mapping for {field}") from err


def _required_str(data: Mapping[str, object], field: str) -> str:
    """Read a required string field from a storage mapping."""
    _LOGGER.debug("Reading required string field %s", field)
    try:
        value = data[field]
        if not isinstance(value, str):
            raise TypeError(f"{field} must be a string")
        return value
    except Exception as err:
        _LOGGER.exception("Invalid required string field %s", field)
        raise ValueError(f"Invalid string field {field}") from err


def _optional_str(data: Mapping[str, object], field: str) -> str | None:
    """Read an optional string field from a storage mapping."""
    _LOGGER.debug("Reading optional string field %s", field)
    try:
        value = data.get(field)
        if value is None:
            return None
        if not isinstance(value, str):
            raise TypeError(f"{field} must be a string or null")
        return value
    except Exception as err:
        _LOGGER.exception("Invalid optional string field %s", field)
        raise ValueError(f"Invalid optional string field {field}") from err


def _required_int(data: Mapping[str, object], field: str) -> int:
    """Read a required integer field from a storage mapping."""
    _LOGGER.debug("Reading required integer field %s", field)
    try:
        value = data[field]
        if not isinstance(value, int) or isinstance(value, bool):
            raise TypeError(f"{field} must be an integer")
        return value
    except Exception as err:
        _LOGGER.exception("Invalid required integer field %s", field)
        raise ValueError(f"Invalid integer field {field}") from err


def _optional_bool(
    data: Mapping[str, object],
    field: str,
    *,
    default: bool,
) -> bool:
    """Read an optional boolean field from a storage mapping."""
    _LOGGER.debug("Reading optional boolean field %s", field)
    try:
        value = data.get(field, default)
        if not isinstance(value, bool):
            raise TypeError(f"{field} must be a boolean")
        return value
    except Exception as err:
        _LOGGER.exception("Invalid optional boolean field %s", field)
        raise ValueError(f"Invalid boolean field {field}") from err


def _optional_mapping(
    data: Mapping[str, object],
    field: str,
) -> Mapping[str, JsonValue]:
    """Read an optional mapping field from a storage mapping."""
    _LOGGER.debug("Reading optional mapping field %s", field)
    try:
        value = data.get(field, {})
        mapping = _as_mapping(value, field)
        return cast(Mapping[str, JsonValue], mapping)
    except Exception as err:
        _LOGGER.exception("Invalid optional mapping field %s", field)
        raise ValueError(f"Invalid mapping field {field}") from err


def _optional_sequence(data: Mapping[str, object], field: str) -> Sequence[object]:
    """Read an optional list field from a storage mapping."""
    _LOGGER.debug("Reading optional sequence field %s", field)
    try:
        value = data.get(field, [])
        if isinstance(value, str) or not isinstance(value, Sequence):
            raise TypeError(f"{field} must be a list")
        return cast(Sequence[object], value)
    except Exception as err:
        _LOGGER.exception("Invalid optional sequence field %s", field)
        raise ValueError(f"Invalid sequence field {field}") from err


def _parse_uuid(value: str, field: str) -> UUID:
    """Parse a UUID field from storage."""
    _LOGGER.debug("Parsing UUID field %s", field)
    try:
        return UUID(value)
    except Exception as err:
        _LOGGER.exception("Invalid UUID field %s", field)
        raise ValueError(f"Invalid UUID field {field}") from err


def _parse_datetime(value: str) -> datetime:
    """Parse an aware datetime from storage and normalize it to UTC."""
    _LOGGER.debug("Parsing datetime value")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            raise ValueError("datetime must include timezone information")
        return parsed.astimezone(timezone.utc)
    except Exception as err:
        _LOGGER.exception("Invalid datetime value")
        raise ValueError("Invalid datetime value") from err


def _optional_datetime(data: Mapping[str, object], field: str) -> datetime | None:
    """Read an optional aware datetime from storage."""
    _LOGGER.debug("Reading optional datetime field %s", field)
    try:
        value = data.get(field)
        if value is None:
            return None
        if not isinstance(value, str):
            raise TypeError(f"{field} must be a datetime string or null")
        return _parse_datetime(value)
    except Exception as err:
        _LOGGER.exception("Invalid optional datetime field %s", field)
        raise ValueError(f"Invalid datetime field {field}") from err


def _format_datetime(value: datetime) -> str:
    """Format an aware datetime for storage."""
    _LOGGER.debug("Formatting datetime value")
    try:
        if value.tzinfo is None:
            raise ValueError("datetime must include timezone information")
        return value.astimezone(timezone.utc).isoformat()
    except Exception as err:
        _LOGGER.exception("Datetime formatting failed")
        raise ValueError("Datetime formatting failed") from err


def _parse_reminder_time(value: str) -> time:
    """Parse an HH:MM reminder time from storage."""
    _LOGGER.debug("Parsing reminder time")
    try:
        parsed = time.fromisoformat(value)
        if parsed.second or parsed.microsecond or parsed.tzinfo is not None:
            raise ValueError("reminder time must use HH:MM format")
        return parsed
    except Exception as err:
        _LOGGER.exception("Invalid reminder time")
        raise ValueError("Invalid reminder time") from err


def _format_reminder_time(value: time) -> str:
    """Format a reminder time as HH:MM for storage."""
    _LOGGER.debug("Formatting reminder time")
    try:
        if value.second or value.microsecond or value.tzinfo is not None:
            raise ValueError("reminder time must not contain seconds or timezone")
        return value.strftime("%H:%M")
    except Exception as err:
        _LOGGER.exception("Reminder time formatting failed")
        raise ValueError("Reminder time formatting failed") from err


def _validate_non_empty(value: str, field: str) -> str:
    """Validate and normalize a non-empty string field."""
    _LOGGER.debug("Validating non-empty string field %s", field)
    try:
        normalized = value.strip()
        if not normalized:
            raise ValueError(f"{field} must not be empty")
        return normalized
    except Exception as err:
        _LOGGER.exception("Invalid non-empty string field %s", field)
        raise ValueError(f"Invalid non-empty string field {field}") from err

