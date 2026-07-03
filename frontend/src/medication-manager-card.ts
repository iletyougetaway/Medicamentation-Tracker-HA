import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HomeAssistant, LovelaceCardConfig } from "./ha";
import { localize } from "./i18n";
import type {
  MedicationDashboard,
  MedicationDashboardItem,
  Reminder,
  WeeklyDay,
} from "./types";

type DialogMode = "add" | "edit";

interface MedicationDialogState {
  confirmDelete: boolean;
  error: string | undefined;
  icon: string;
  medicationEnabled: boolean;
  medicationId: string | undefined;
  mode: DialogMode;
  name: string;
  originalTagId: string | null;
  reminders: Reminder[];
  remindersEnabled: boolean;
  saving: boolean;
  tagId: string;
}

@customElement("medication-manager")
export class MedicationManagerCard extends LitElement {
  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private _config: LovelaceCardConfig = { type: "custom:medication-manager" };

  @state()
  private _dashboard?: MedicationDashboard;

  @state()
  private _dialog: MedicationDialogState | undefined;

  @state()
  private _error: string | undefined;

  @state()
  private _busyMedicationId: string | undefined;

  private _unsubscribe: (() => void) | undefined;

  public static getStubConfig(): LovelaceCardConfig {
    return { type: "custom:medication-manager" };
  }

  public setConfig(config: LovelaceCardConfig): void {
    this._config = config;
  }

  public getCardSize(): number {
    return Math.max(3, this._dashboard?.medications.length ?? 1);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    void this._subscribe();
    void this._loadDashboard();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
    this._unsubscribe = undefined;
  }

  protected override updated(changed: Map<string, unknown>): void {
    if (changed.has("hass")) {
      void this._subscribe();
      void this._loadDashboard();
    }
  }

  protected override render() {
    const hass = this.hass;
    const language = this._language;
    const title = this._config.title ?? localize(language, "title");

    if (this._error) {
      return html`<ha-card><div class="error">${this._error}</div></ha-card>`;
    }

    return html`
      <ha-card>
        <header>
          <h2>${title}</h2>
          <button
            class="button filled"
            type="button"
            @click=${() => this._openAddDialog()}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
            ${localize(language, "add")}
          </button>
        </header>
        <section>
          ${this._dashboard?.medications.length
            ? this._dashboard.medications.map((item) =>
                this._renderMedication(item, language),
              )
            : html`<div class="empty">${localize(language, "empty")}</div>`}
        </section>
      </ha-card>
      ${this._renderMedicationDialog(language)}
    `;
  }

  private _renderMedication(item: MedicationDashboardItem, language: string) {
    const taking = this._busyMedicationId === item.id;

    return html`
      <article class=${item.enabled ? "medication" : "medication disabled"}>
        <div class="identity">
          <ha-icon .icon=${item.icon}></ha-icon>
          <div>
            <h3>${item.name}</h3>
            <p>${this._statusLabel(item.today_status, language)}</p>
          </div>
          <ha-icon-button
            .label=${localize(language, "take")}
            aria-label=${localize(language, "take")}
            title=${localize(language, "take")}
            ?disabled=${taking}
            @click=${() => this._takeMedication(item)}
          >
            <ha-icon icon="mdi:check"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${localize(language, "edit")}
            aria-label=${localize(language, "edit")}
            title=${localize(language, "edit")}
            @click=${() => this._openEditDialog(item)}
          >
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
        </div>
        <dl>
          <div>
            <dt>${localize(language, "next")}</dt>
            <dd>${this._nextReminder(item, language)}</dd>
          </div>
          <div>
            <dt>${localize(language, "last")}</dt>
            <dd>${this._lastIntake(item, language)}</dd>
          </div>
        </dl>
        <div class="week">
          ${item.weekly_history.map((day) =>
            this._renderWeeklyDay(item, day, language),
          )}
        </div>
      </article>
    `;
  }

  private _renderWeeklyDay(
    item: MedicationDashboardItem,
    day: WeeklyDay,
    language: string,
  ) {
    const statusClass = day.is_future ? "future" : day.status ?? "none";
    const statusLabel = day.status
      ? this._statusLabel(day.status, language)
      : localize(language, "none");

    return html`
      <span class=${statusClass} title=${`${day.date}: ${statusLabel}`}>
        ${this._weeklyContent(item, day)}
      </span>
    `;
  }

  private _weeklyContent(item: MedicationDashboardItem, day: WeeklyDay) {
    if (day.is_future || day.status === null || day.status === "missed") {
      return nothing;
    }
    if (day.status === "late") {
      return html`<span class="late-marker"></span>`;
    }
    return html`<ha-icon .icon=${item.icon}></ha-icon>`;
  }

  private _renderMedicationDialog(language: string) {
    const dialog = this._dialog;
    if (!dialog) return nothing;

    const title =
      dialog.mode === "add"
        ? localize(language, "addMedication")
        : localize(language, "editMedication");

    return html`
      <ha-dialog
        open
        .headerTitle=${title}
        .heading=${title}
        header-title=${title}
        @closed=${() => this._closeDialog()}
      >
        <div class="dialog-content">
          <form class="dialog-form">
            ${dialog.error
              ? html`<div class="dialog-error">${dialog.error}</div>`
              : nothing}
            ${this._renderTextField({
              disabled: dialog.saving,
              label: localize(language, "name"),
              required: true,
              value: dialog.name,
              onInput: (value) => this._updateDialog({ name: value }),
            })}
            ${this._renderTextField({
              disabled: dialog.saving,
              label: localize(language, "icon"),
              value: dialog.icon,
              onInput: (value) => this._updateDialog({ icon: value }),
            })}
            ${this._renderTextField({
              disabled: dialog.saving,
              label: localize(language, "nfcTag"),
              value: dialog.tagId,
              onInput: (value) => this._updateDialog({ tagId: value }),
            })}
            <label class="toggle-row">
              <ha-checkbox
                .checked=${dialog.medicationEnabled}
                ?disabled=${dialog.saving}
                @change=${(event: Event) =>
                  this._updateDialog({
                    medicationEnabled: this._checkedValue(event),
                  })}
              ></ha-checkbox>
              <span>${localize(language, "enableMedication")}</span>
            </label>
            <label class="toggle-row">
              <ha-checkbox
                .checked=${dialog.remindersEnabled}
                ?disabled=${dialog.saving}
                @change=${(event: Event) =>
                  this._updateDialog({
                    remindersEnabled: this._checkedValue(event),
                  })}
              ></ha-checkbox>
              <span>${localize(language, "enableReminders")}</span>
            </label>
            <fieldset>
              <legend>${localize(language, "reminders")}</legend>
              ${dialog.reminders.length
                ? dialog.reminders.map((reminder, index) =>
                    this._renderReminderRow(reminder, index, language),
                  )
                : html`
                    <div class="reminder-empty">
                      ${localize(language, "noReminders")}
                    </div>
                  `}
              <button
                class="button outlined"
                type="button"
                ?disabled=${dialog.saving}
                @click=${() => this._addReminder()}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
                ${localize(language, "addReminder")}
              </button>
            </fieldset>
          </form>
          <div class="dialog-actions">
            ${this._renderDeleteActions(dialog, language)}
            <span class="action-spacer"></span>
            <button
              class="button text"
              type="button"
              ?disabled=${dialog.saving}
              @click=${() => this._closeDialog()}
            >
              ${localize(language, "cancel")}
            </button>
            <button
              class="button filled"
              type="button"
              ?disabled=${dialog.saving}
              @click=${() => this._saveDialog()}
            >
              ${localize(language, "save")}
            </button>
          </div>
        </div>
      </ha-dialog>
    `;
  }

  private _renderReminderRow(
    reminder: Reminder,
    index: number,
    language: string,
  ) {
    const dialog = this._dialog;
    const disabled = !dialog?.remindersEnabled || Boolean(dialog.saving);

    return html`
      <div class="reminder-row">
        ${this._renderTextField({
          disabled,
          label: localize(language, "reminderTime"),
          type: "time",
          value: reminder.time,
          onInput: (value) => this._updateReminderTime(index, value),
        })}
        <label class="inline-check">
          <ha-checkbox
            .checked=${reminder.enabled}
            ?disabled=${disabled}
            @change=${(event: Event) =>
              this._updateReminderEnabled(index, this._checkedValue(event))}
          ></ha-checkbox>
          <span>${localize(language, "enableReminder")}</span>
        </label>
        <ha-icon-button
          .label=${localize(language, "removeReminder")}
          aria-label=${localize(language, "removeReminder")}
          title=${localize(language, "removeReminder")}
          ?disabled=${dialog?.saving}
          @click=${() => this._removeReminder(index)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  private _renderDeleteActions(
    dialog: MedicationDialogState,
    language: string,
  ) {
    if (dialog.mode !== "edit") return nothing;

    if (!dialog.confirmDelete) {
      return html`
        <button
          class="button outlined danger"
          type="button"
          ?disabled=${dialog.saving}
          @click=${() => this._updateDialog({ confirmDelete: true })}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          ${localize(language, "delete")}
        </button>
      `;
    }

    return html`
      <span class="delete-confirm">${localize(language, "deleteConfirm")}</span>
      <button
        class="button text"
        type="button"
        ?disabled=${dialog.saving}
        @click=${() => this._updateDialog({ confirmDelete: false })}
      >
        ${localize(language, "cancel")}
      </button>
      <button
        class="button outlined danger"
        type="button"
        ?disabled=${dialog.saving}
        @click=${() => this._deleteMedication()}
      >
        ${localize(language, "deleteMedication")}
      </button>
    `;
  }

  private _statusLabel(
    status: MedicationDashboardItem["today_status"],
    language: string,
  ): string {
    if (status === "taken") return localize(language, "taken");
    if (status === "late") return localize(language, "late");
    if (status === "missed") return localize(language, "missed");
    return localize(language, "today");
  }

  private get _language(): string {
    return this.hass?.locale?.language ?? this.hass?.language ?? "ru";
  }

  private _renderTextField(config: {
    disabled: boolean;
    label: string;
    onInput: (value: string) => void;
    required?: boolean;
    type?: string;
    value: string;
  }) {
    return html`
      <label class="text-field">
        <span>${config.label}</span>
        <input
          .value=${config.value}
          ?disabled=${config.disabled}
          ?required=${config.required ?? false}
          type=${config.type ?? "text"}
          @input=${(event: Event) =>
            config.onInput(this._stringValue(event))}
        />
      </label>
    `;
  }

  private _nextReminder(
    item: MedicationDashboardItem,
    language: string,
  ): string {
    if (!item.next_reminder) return localize(language, "none");
    return item.next_reminder.time;
  }

  private _lastIntake(
    item: MedicationDashboardItem,
    language: string,
  ): string {
    if (!item.last_intake) return localize(language, "none");
    return new Date(item.last_intake.taken_time).toLocaleString(language);
  }

  private async _subscribe(): Promise<void> {
    if (!this.hass || this._unsubscribe) return;
    this._unsubscribe = await this.hass.connection.subscribeEvents(
      () => void this._loadDashboard(),
      "medication_manager_data_updated",
    );
  }

  private async _loadDashboard(): Promise<void> {
    if (!this.hass) return;
    try {
      const message: Record<string, unknown> = {
        type: "medication_manager/dashboard",
      };
      if (this._config.config_entry_id) {
        message.config_entry_id = this._config.config_entry_id;
      }
      this._dashboard = await this.hass.callWS<MedicationDashboard>(message);
      this._error = undefined;
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    }
  }

  private async _takeMedication(item: MedicationDashboardItem): Promise<void> {
    if (!this.hass || !this._dashboard || this._busyMedicationId) return;
    try {
      this._busyMedicationId = item.id;
      await this.hass.callService("medication_manager", "take_medication", {
        config_entry_id: this._dashboard.config_entry_id,
        medication_id: item.id,
        source: "button",
      });
      await this._loadDashboard();
      this._error = undefined;
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    } finally {
      this._busyMedicationId = undefined;
    }
  }

  private _openAddDialog(): void {
    this._dialog = {
      confirmDelete: false,
      error: undefined,
      icon: "mdi:pill",
      medicationEnabled: true,
      medicationId: undefined,
      mode: "add",
      name: "",
      originalTagId: null,
      reminders: [{ time: "08:00", enabled: true }],
      remindersEnabled: true,
      saving: false,
      tagId: "",
    };
  }

  private _openEditDialog(item: MedicationDashboardItem): void {
    this._dialog = {
      confirmDelete: false,
      error: undefined,
      icon: item.icon,
      medicationEnabled: item.enabled,
      medicationId: item.id,
      mode: "edit",
      name: item.name,
      originalTagId: item.tag_id,
      reminders: item.schedule.map((reminder) => ({ ...reminder })),
      remindersEnabled: item.schedule.some((reminder) => reminder.enabled),
      saving: false,
      tagId: item.tag_id ?? "",
    };
  }

  private _closeDialog(): void {
    if (this._dialog?.saving) return;
    this._dialog = undefined;
  }

  private _updateDialog(update: Partial<MedicationDialogState>): void {
    if (!this._dialog) return;
    this._dialog = {
      ...this._dialog,
      ...update,
      confirmDelete: update.confirmDelete ?? this._dialog.confirmDelete,
      error: update.error ?? undefined,
    };
  }

  private _addReminder(): void {
    const dialog = this._dialog;
    if (!dialog) return;
    this._updateDialog({
      reminders: [
        ...dialog.reminders,
        { time: this._nextAvailableReminderTime(dialog.reminders), enabled: true },
      ],
      remindersEnabled: true,
    });
  }

  private _removeReminder(index: number): void {
    const dialog = this._dialog;
    if (!dialog) return;
    this._updateDialog({
      reminders: dialog.reminders.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  private _updateReminderTime(index: number, time: string): void {
    const dialog = this._dialog;
    if (!dialog) return;
    this._updateDialog({
      reminders: dialog.reminders.map((reminder, itemIndex) =>
        itemIndex === index ? { ...reminder, time } : reminder,
      ),
    });
  }

  private _updateReminderEnabled(index: number, enabled: boolean): void {
    const dialog = this._dialog;
    if (!dialog) return;
    this._updateDialog({
      reminders: dialog.reminders.map((reminder, itemIndex) =>
        itemIndex === index ? { ...reminder, enabled } : reminder,
      ),
    });
  }

  private async _saveDialog(): Promise<void> {
    if (!this.hass || !this._dashboard || !this._dialog) return;

    const language = this._language;
    const payload = this._dialogPayload(language);
    if (!payload) return;

    try {
      this._updateDialog({ saving: true, error: undefined });
      const serviceData = {
        config_entry_id: this._dashboard.config_entry_id,
        ...payload,
      };
      if (this._dialog.mode === "add") {
        await this.hass.callService(
          "medication_manager",
          "add_medication",
          serviceData,
        );
      } else {
        await this.hass.callService("medication_manager", "update_medication", {
          ...serviceData,
          medication_id: this._dialog.medicationId,
        });
      }
      this._dialog = undefined;
      await this._loadDashboard();
    } catch (err) {
      this._updateDialog({
        error: err instanceof Error ? err.message : String(err),
        saving: false,
      });
    }
  }

  private async _deleteMedication(): Promise<void> {
    if (!this.hass || !this._dashboard || !this._dialog?.medicationId) return;
    try {
      this._updateDialog({ saving: true, error: undefined });
      await this.hass.callService("medication_manager", "delete_medication", {
        config_entry_id: this._dashboard.config_entry_id,
        medication_id: this._dialog.medicationId,
      });
      this._dialog = undefined;
      await this._loadDashboard();
    } catch (err) {
      this._updateDialog({
        error: err instanceof Error ? err.message : String(err),
        saving: false,
      });
    }
  }

  private _dialogPayload(
    language: string,
  ): Record<string, unknown> | undefined {
    const dialog = this._dialog;
    if (!dialog) return undefined;

    const name = dialog.name.trim();
    if (!name) {
      this._updateDialog({ error: localize(language, "requiredName") });
      return undefined;
    }

    const reminders = this._validatedReminders(language);
    if (!reminders) return undefined;

    const tagId = dialog.tagId.trim();
    const payload: Record<string, unknown> = {
      enabled: dialog.medicationEnabled,
      icon: dialog.icon.trim() || "mdi:pill",
      name,
      reminders,
    };

    if (tagId) {
      payload.tag_id = tagId;
    } else if (dialog.mode === "edit" && dialog.originalTagId) {
      payload.clear_tag = true;
    }

    return payload;
  }

  private _validatedReminders(language: string): Reminder[] | undefined {
    const dialog = this._dialog;
    if (!dialog) return undefined;

    const seen = new Set<string>();
    const reminders: Reminder[] = [];

    for (const reminder of dialog.reminders) {
      const time = reminder.time.trim();
      if (!time) continue;
      if (!this._validReminderTime(time) || seen.has(time)) {
        this._updateDialog({ error: localize(language, "invalidReminder") });
        return undefined;
      }
      seen.add(time);
      reminders.push({
        enabled: dialog.remindersEnabled && reminder.enabled,
        time,
      });
    }

    return reminders;
  }

  private _validReminderTime(value: string): boolean {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
    return match !== null;
  }

  private _nextAvailableReminderTime(reminders: Reminder[]): string {
    const used = new Set(reminders.map((reminder) => reminder.time));
    for (const time of ["08:00", "12:00", "20:00"]) {
      if (!used.has(time)) return time;
    }
    for (let hour = 0; hour < 24; hour += 1) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      if (!used.has(time)) return time;
    }
    return "08:00";
  }

  private _stringValue(event: Event): string {
    return (event.currentTarget as HTMLInputElement).value;
  }

  private _checkedValue(event: Event): boolean {
    return (event.currentTarget as HTMLInputElement).checked;
  }

  public static override styles = css`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    header {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
      padding: 16px;
    }

    h2,
    h3,
    p,
    dl {
      margin: 0;
    }

    h2 {
      font-size: 20px;
      font-weight: 600;
    }

    section {
      background: var(--divider-color);
      display: grid;
      gap: 1px;
    }

    .empty,
    .error {
      background: var(--card-background-color);
      padding: 16px;
    }

    .medication {
      background: var(--card-background-color);
      display: grid;
      gap: 12px;
      padding: 14px 16px 16px;
    }

    .disabled {
      opacity: 0.56;
    }

    .identity {
      align-items: center;
      display: grid;
      gap: 8px;
      grid-template-columns: 40px 1fr 40px 40px;
    }

    .identity > ha-icon {
      color: var(--primary-color);
      height: 32px;
      width: 32px;
    }

    .identity ha-icon-button,
    .reminder-row ha-icon-button {
      --ha-icon-button-size: 40px;
      color: var(--primary-text-color);
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }

    p,
    dt {
      color: var(--secondary-text-color);
      font-size: 12px;
    }

    dl {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    dd {
      font-size: 14px;
      margin: 2px 0 0;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .week {
      display: grid;
      gap: 6px;
      grid-template-columns: repeat(7, minmax(0, 1fr));
    }

    .week span {
      align-items: center;
      aspect-ratio: 1;
      background: var(--secondary-background-color);
      border-radius: 6px;
      display: flex;
      justify-content: center;
      line-height: 1;
      min-width: 0;
    }

    .week ha-icon {
      height: 18px;
      width: 18px;
    }

    .week .taken {
      background: color-mix(in srgb, var(--success-color) 20%, transparent);
      color: var(--success-color);
    }

    .week .late {
      background: color-mix(in srgb, #f5c542 24%, transparent);
    }

    .week .missed,
    .week .none {
      background: color-mix(in srgb, var(--error-color) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--error-color) 22%, transparent);
    }

    .week .future {
      background: transparent;
      border: 1px dashed var(--divider-color);
    }

    .late-marker {
      background: #f5c542;
      border-radius: 50%;
      display: block;
      height: 12px;
      width: 12px;
    }

    .button {
      align-items: center;
      appearance: none;
      border: 0;
      border-radius: 9999px;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      gap: 8px;
      justify-content: center;
      letter-spacing: 0;
      line-height: 20px;
      min-height: 40px;
      min-width: 64px;
      outline: none;
      padding: 10px 24px;
      position: relative;
      text-decoration: none;
      user-select: none;
      white-space: nowrap;
    }

    .button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .button:disabled {
      cursor: default;
      opacity: 0.38;
      pointer-events: none;
    }

    .button ha-icon {
      height: 18px;
      width: 18px;
    }

    .button.filled {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
    }

    .button.outlined,
    .button.text {
      background: transparent;
      color: var(--primary-color);
    }

    .button.outlined {
      border: 1px solid var(--divider-color);
    }

    .button:is(.outlined, .text):hover:not(:disabled) {
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }

    .button.filled:hover:not(:disabled) {
      filter: brightness(1.04);
    }

    .button.outlined.danger,
    .button.text.danger {
      color: var(--error-color);
    }

    .button.outlined.danger {
      border-color: var(--error-color);
    }

    .button.outlined.danger:hover:not(:disabled),
    .button.text.danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--error-color) 8%, transparent);
    }

    ha-dialog {
      --ha-dialog-header-title-color: var(--primary-text-color);
      --ha-dialog-surface-background: var(--card-background-color);
      --ha-dialog-width-md: 560px;
    }

    .dialog-content,
    .dialog-form {
      display: grid;
      gap: 16px;
    }

    .dialog-content {
      box-sizing: border-box;
      min-width: min(520px, calc(100vw - 48px));
      padding-top: 4px;
    }

    .text-field {
      display: block;
      min-width: 0;
      position: relative;
    }

    .text-field span {
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      font-size: 12px;
      inset-inline-start: 12px;
      line-height: 16px;
      max-width: calc(100% - 24px);
      overflow: hidden;
      padding: 0 4px;
      position: absolute;
      text-overflow: ellipsis;
      top: -8px;
      white-space: nowrap;
      z-index: 1;
    }

    .text-field input {
      background: var(--card-background-color);
      border: 1px solid var(--outline-color, var(--divider-color));
      border-radius: 6px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 15px;
      height: 48px;
      line-height: 20px;
      min-width: 0;
      outline: none;
      padding: 14px 14px 10px;
      transition:
        border-color 120ms ease,
        box-shadow 120ms ease;
      width: 100%;
    }

    .text-field input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }

    .text-field input:disabled {
      color: var(--disabled-text-color);
      opacity: 0.6;
    }

    .text-field input[type="time"] {
      color-scheme: light dark;
    }

    .dialog-error {
      background: color-mix(in srgb, var(--error-color) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--error-color) 35%, transparent);
      border-radius: 6px;
      color: var(--error-color);
      padding: 10px 12px;
    }

    .toggle-row,
    .inline-check {
      align-items: center;
      display: flex;
      gap: 10px;
      min-width: 0;
    }

    .inline-check {
      min-height: 40px;
    }

    .toggle-row span,
    .inline-check span {
      overflow-wrap: anywhere;
    }

    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 12px;
    }

    legend {
      color: var(--secondary-text-color);
      font-size: 12px;
      padding: 0 4px;
    }

    .reminder-row {
      align-items: center;
      display: grid;
      gap: 10px;
      grid-template-columns: minmax(136px, 160px) minmax(160px, 1fr) 40px;
    }

    .reminder-empty {
      color: var(--secondary-text-color);
      font-size: 13px;
      padding: 2px 0;
    }

    .dialog-actions {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
      padding-top: 2px;
      width: 100%;
    }

    .action-spacer {
      flex: 1 1 auto;
    }

    .delete-confirm {
      color: var(--error-color);
      font-size: 13px;
      margin-inline-end: 4px;
    }

    @media (max-width: 520px) {
      header {
        align-items: stretch;
        flex-direction: column;
      }

      .reminder-row {
        align-items: start;
        grid-template-columns: 1fr 40px;
      }

      .reminder-row .inline-check {
        grid-column: 1 / -1;
        grid-row: 2;
      }

      .dialog-content {
        min-width: 0;
      }

      .dialog-actions {
        justify-content: stretch;
      }

      .dialog-actions .button {
        flex: 1 1 auto;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "medication-manager": MedicationManagerCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "medication-manager",
  name: "Менеджер лекарств",
  description: "Список лекарств и недельная история",
});
