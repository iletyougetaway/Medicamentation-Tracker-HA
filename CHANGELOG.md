# Changelog

## 0.7.7

- Keep future history markers based on the planned daily dose count instead of
  expanding them from higher intake counts recorded on previous days.

## 0.7.6

- Fix monthly history dialog width so the calendar grid stays centered without
  horizontal scrolling.

## 0.7.5

- Add optional medication course end dates, including a permanent-course mode.
- Stop reminder scheduling after a medication course end date.
- Add monthly medication history from the card.
- Fix weekly intake icon sizing and centering.

## 0.7.4

- Slightly increase the medication icon size in weekly taken intake markers.

## 0.7.3

- Keep weekly daily intake markers centered inside each day cell.
- Use compact medication icons for taken intakes and smaller markers for other
  intake states.

## 0.7.2

- Update the Lovelace card resource version so Home Assistant reloads the
  latest frontend bundle.
- Show dates as `dd.mm.yyyy` and omit seconds from displayed date-time values.
- Replace the dashboard label "Следующее" with "Напоминание".
- Group weekly history by day and show multiple daily intakes inside each day.
- Add a daily intake count field for configuring reminder rows.
- Hide medication creation from the normal card view and show it only while the
  dashboard is being edited.

## 0.7.1

- Fix integration startup on Home Assistant versions that no longer expose
  `async_track_event` from `homeassistant.helpers.event`.
- Use the Home Assistant event bus directly for NFC scans, notification actions,
  and scheduler data refresh events.

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
