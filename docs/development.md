# Development

Medication Manager is built as a Home Assistant custom integration with a
bundled Lovelace card.

## Backend Checks

Run these checks before opening a pull request:

```bash
python -m compileall -q custom_components tests
python -m ruff check custom_components tests
```

Run `python -m mypy custom_components tests` in an environment that has Home
Assistant development dependencies installed.

The unit tests in `tests/` cover pure domain logic and can be collected by
pytest in a full development environment. They also support an isolated smoke
run without Home Assistant installed:

```bash
python -c "import logging; logging.disable(logging.CRITICAL); import tests.conftest; from tests import test_history, test_manager, test_models; test_models.test_storage_payload_round_trip(); test_models.test_invalid_storage_payload_is_rejected(); test_history.test_weekly_summary_marks_status_counts_and_future_days(); test_history.test_history_range_filter_orders_newest_first(); test_manager.test_manager_crud_and_late_intake(); test_manager.test_manager_rejects_duplicate_tag()"
```

## Frontend Checks

Install dependencies once:

```bash
cd frontend
npm install
```

Then run:

```bash
npm run typecheck
npm run build
```

The production bundle is written to
`custom_components/medication_manager/frontend/medication-manager-card.js` and
must be committed for HACS installs.

## Release Checklist

1. Update `VERSION` in `custom_components/medication_manager/const.py`.
2. Update `version` in `manifest.json`, `pyproject.toml`, and
   `frontend/package.json`.
3. Rebuild the frontend bundle.
4. Add a `CHANGELOG.md` entry.
5. Run backend and frontend checks.
