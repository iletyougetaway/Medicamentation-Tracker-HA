# Medication Manager

Medication Manager is a Home Assistant custom integration for medication
tracking with NFC tags, reminders, history, and a Lovelace card.

This repository is being built feature-by-feature. Version `0.6.0` contains
the backend integration foundation, medication CRUD, history, notifications,
NFC intake handling, and the Lovelace dashboard card.

## Requirements

- Home Assistant Core 2026 or newer
- Python 3.13 or newer
- HACS custom integration installation

## Configuration

Medication Manager is configured from the Home Assistant UI.

1. Install the integration through HACS.
2. Restart Home Assistant.
3. Go to **Settings** > **Devices & services**.
4. Add **Medication Manager**.
5. Configure the optional `mobile_app` notify service in the integration
   options to enable automatic reminder notifications.

No YAML configuration is supported or required.

## Lovelace Card

Add this JavaScript module as a dashboard resource:

```text
/medication_manager/frontend/medication-manager-card.js?v=0.7.1
```

Then add the **Medication Manager** card from the dashboard UI. The card type is
`custom:medication-manager`.

The card updates live when medication data changes. It displays the medication
list, today's state, next reminder, last intake, and weekly history. Medication
creation and editing are handled from the card UI without YAML.

Russian quick-start documentation is available in
[`docs/ru/quick-start.md`](docs/ru/quick-start.md).

Development notes are available in [`docs/development.md`](docs/development.md)
and [`docs/ru/development.md`](docs/ru/development.md).

## License

Medication Manager is released under the MIT License.
