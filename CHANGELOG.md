# Changelog

## 0.7.0

- Add the automatic medication reminder scheduler.
- Add UI options for the mobile app notify service and snooze duration.
- Reschedule reminder callbacks when medication data changes.

## 0.6.0

- Add the Lovelace dashboard WebSocket API.
- Add static frontend asset serving for the custom card.
- Add the `custom:medication-manager` Lit card with live dashboard updates.
- Add Material Web add and edit medication dialogs with NFC tag and reminders.
- Add weekly history rendering with medication icons and late/missed states.

## 0.5.0

- Add the NFC tag event engine.
- Subscribe to Home Assistant tag scan events without user automations.
- Record medication intake history from bound NFC tags.
- Clear active medication reminder notifications after NFC intake.

## 0.4.0

- Add an independent mobile app notification engine.
- Add actionable reminder notifications with Take and Remind Later actions.
- Store active notification metadata in Home Assistant storage settings.
- Add the `send_reminder` service action for mobile app reminder delivery.

## 0.3.0

- Add the independent medication history engine.
- Add history persistence and query helpers to the manager.
- Add the `take_medication` service action for recording intake history.
- Add localized Home Assistant service metadata for history recording.

## 0.2.0

- Add storage-backed medication CRUD in the domain manager.
- Register UI service actions for adding, updating, deleting, and binding NFC tags.
- Add Home Assistant service metadata, service icons, and Russian translations.

## 0.1.0

- Add the initial Home Assistant custom integration skeleton.
- Add UI config flow support with a single config entry.
- Add storage-backed medication, reminder, and history models.
- Add the manager and data update coordinator used by later milestones.
