# Разработка

Менеджер лекарств состоит из пользовательской интеграции Home Assistant и
собранной Lovelace-карточки.

## Проверки серверной части

Перед pull request выполните:

```bash
python -m compileall -q custom_components tests
python -m ruff check custom_components tests
```

`python -m mypy custom_components tests` запускайте в окружении, где установлены
зависимости Home Assistant для разработки.

Тесты в `tests/` покрывают доменную логику. В полном окружении разработки их
можно запускать через pytest. Также доступен изолированный smoke-прогон без
установленного Home Assistant:

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

Готовый production bundle записывается в
`custom_components/medication_manager/frontend/medication-manager-card.js`.
Этот файл должен быть в репозитории, потому что HACS устанавливает уже
собранную карточку.

## Чеклист релиза

1. Обновить `VERSION` в `custom_components/medication_manager/const.py`.
2. Обновить `version` в `manifest.json`, `pyproject.toml` и
   `frontend/package.json`.
3. Пересобрать frontend bundle.
4. Добавить запись в `CHANGELOG.md`.
5. Запустить проверки серверной части и frontend.
