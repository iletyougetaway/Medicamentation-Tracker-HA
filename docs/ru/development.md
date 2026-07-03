# Разработка

Medication Manager состоит из backend-интеграции Home Assistant и собранной
Lovelace-карточки.

## Проверки backend

Перед pull request выполните:

```bash
python -m compileall -q custom_components tests
python -m ruff check custom_components tests
```

`python -m mypy custom_components tests` запускайте в окружении, где установлены
dev-зависимости Home Assistant.

Тесты в `tests/` покрывают чистую доменную логику. В полном окружении их можно
запускать через pytest. Без установленного Home Assistant доступен изолированный
smoke-прогон:

```bash
python -c "import logging; logging.disable(logging.CRITICAL); import tests.conftest; from tests import test_history, test_manager, test_models; test_models.test_storage_payload_round_trip(); test_models.test_invalid_storage_payload_is_rejected(); test_history.test_weekly_summary_marks_status_counts_and_future_days(); test_history.test_history_range_filter_orders_newest_first(); test_manager.test_manager_crud_and_late_intake(); test_manager.test_manager_rejects_duplicate_tag()"
```

## Проверки frontend

Один раз установите зависимости:

```bash
cd frontend
npm install
```

Затем выполните:

```bash
npm run typecheck
npm run build
```

Production bundle записывается в
`custom_components/medication_manager/frontend/medication-manager-card.js`. Этот
файл должен быть в репозитории, потому что HACS устанавливает готовую карточку.

## Чеклист релиза

1. Обновить `VERSION` в `custom_components/medication_manager/const.py`.
2. Обновить `version` в `manifest.json`, `pyproject.toml` и
   `frontend/package.json`.
3. Пересобрать frontend bundle.
4. Добавить запись в `CHANGELOG.md`.
5. Запустить backend и frontend проверки.
