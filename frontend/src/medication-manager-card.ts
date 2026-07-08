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
  courseAlways: boolean;
  courseEndDate: string;
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

  @property({ type: Boolean, attribute: "edit-mode" })
  public editMode = false;

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

  @state()
  private _historyMedicationId: string | undefined;

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
          ${this._showAddButton
            ? html`
                <button
                  class="button filled"
                  type="button"
                  @click=${() => this._openAddDialog()}
                >
                  <ha-icon icon="mdi:plus"></ha-icon>
                  ${localize(language, "add")}
                </button>
              `
            : nothing}
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
      ${this._renderMonthlyHistoryDialog(language)}
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
            <p>${this._medicationStatusLabel(item, language)}</p>
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
            .label=${localize(language, "monthlyHistory")}
            aria-label=${localize(language, "monthlyHistory")}
            title=${localize(language, "monthlyHistory")}
            @click=${() => this._openMonthlyHistory(item)}
          >
            <ha-icon icon="mdi:calendar-month"></ha-icon>
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
    const doseCount = this._dayDoseCount(item, day);

    return html`
      <span
        class=${`week-day ${statusClass}`}
        title=${this._weeklyTitle(day, statusLabel, language)}
      >
        <span class="week-date">${this._formatDate(day.date)}</span>
        <span class="week-doses" style=${this._doseGridStyle(doseCount)}>
          ${this._weeklyContent(item, day, doseCount)}
        </span>
      </span>
    `;
  }

  private _weeklyContent(
    item: MedicationDashboardItem,
    day: WeeklyDay,
    doseCount: number,
  ) {
    const statuses: string[] = [];

    if (day.is_future) {
      statuses.push(...Array.from({ length: doseCount }, () => "future"));
    } else {
      statuses.push(...Array.from({ length: day.taken_count }, () => "taken"));
      statuses.push(...Array.from({ length: day.late_count }, () => "late"));
      statuses.push(...Array.from({ length: day.missed_count }, () => "missed"));
      while (statuses.length < doseCount) statuses.push("empty");
    }

    return statuses.map((status) => {
      if (status === "taken") {
        return html`
          <span class="dose taken">
            <ha-icon class="dose-icon" .icon=${item.icon}></ha-icon>
          </span>
        `;
      }
      return html`<span class=${`dose ${status}`}></span>`;
    });
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
                .checked=${dialog.courseAlways}
                ?disabled=${dialog.saving}
                @change=${(event: Event) =>
                  this._updateDialog({
                    courseAlways: this._checkedValue(event),
                  })}
              ></ha-checkbox>
              <span>${localize(language, "courseAlways")}</span>
            </label>
            ${this._renderTextField({
              disabled: dialog.saving || dialog.courseAlways,
              label: localize(language, "courseEndDate"),
              required: !dialog.courseAlways,
              type: "date",
              value: dialog.courseEndDate,
              onInput: (value) => this._updateDialog({ courseEndDate: value }),
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
              <div class="reminder-count">
                ${this._renderTextField({
                  disabled: dialog.saving,
                  label: localize(language, "dailyDoseCount"),
                  max: "12",
                  min: "0",
                  step: "1",
                  type: "number",
                  value: String(dialog.reminders.length),
                  onInput: (value) => this._updateReminderCount(value),
                })}
              </div>
              ${dialog.reminders.length
                ? dialog.reminders.map((reminder, index) =>
                    this._renderReminderRow(reminder, index, language),
                  )
                : html`
                    <div class="reminder-empty">
                      ${localize(language, "noReminders")}
                    </div>
                  `}
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

  private _renderMonthlyHistoryDialog(language: string) {
    const item = this._historyMedication();
    if (!item) return nothing;

    const title = `${localize(language, "monthlyHistory")}: ${item.name}`;
    const paddingDays = this._monthLeadingBlankCount(item.monthly_history);

    return html`
      <ha-dialog
        open
        .headerTitle=${title}
        .heading=${title}
        header-title=${title}
        @closed=${() => this._closeMonthlyHistory()}
      >
        <div class="dialog-content history-dialog">
          <div class="month-title">
            ${this._monthLabel(item.monthly_history[0]?.date, language)}
          </div>
          <div class="month-grid">
            ${this._weekdayLabels().map(
              (label) => html`<span class="month-weekday">${label}</span>`,
            )}
            ${Array.from({ length: paddingDays }, () =>
              html`<span class="month-spacer"></span>`,
            )}
            ${item.monthly_history.map((day) =>
              this._renderMonthlyDay(item, day, language),
            )}
          </div>
          <div class="dialog-actions">
            <button
              class="button filled"
              type="button"
              @click=${() => this._closeMonthlyHistory()}
            >
              ${localize(language, "close")}
            </button>
          </div>
        </div>
      </ha-dialog>
    `;
  }

  private _renderMonthlyDay(
    item: MedicationDashboardItem,
    day: WeeklyDay,
    language: string,
  ) {
    const statusClass = day.is_future ? "future" : day.status ?? "none";
    const statusLabel = day.status
      ? this._statusLabel(day.status, language)
      : localize(language, "none");
    const doseCount = this._dayDoseCount(item, day);

    return html`
      <span
        class=${`month-day ${statusClass}`}
        title=${this._weeklyTitle(day, statusLabel, language)}
      >
        <span class="month-date">${this._dayNumber(day.date)}</span>
        <span
          class="week-doses month-doses"
          style=${this._doseGridStyle(doseCount)}
        >
          ${this._weeklyContent(item, day, doseCount)}
        </span>
      </span>
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

  private _medicationStatusLabel(
    item: MedicationDashboardItem,
    language: string,
  ): string {
    if (this._courseEnded(item)) return localize(language, "courseEnded");
    return this._statusLabel(item.today_status, language);
  }

  private get _language(): string {
    return this.hass?.locale?.language ?? this.hass?.language ?? "ru";
  }

  private get _showAddButton(): boolean {
    return this.editMode || this.hasAttribute("edit-mode");
  }

  private _renderTextField(config: {
    disabled: boolean;
    label: string;
    max?: string;
    min?: string;
    onInput: (value: string) => void;
    required?: boolean;
    step?: string;
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
          max=${config.max ?? nothing}
          min=${config.min ?? nothing}
          step=${config.step ?? nothing}
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
    return this._formatDateTime(item.last_intake.taken_time);
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
      courseAlways: true,
      courseEndDate: "",
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
      courseAlways: item.course_end_date === null,
      courseEndDate: item.course_end_date ?? "",
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

  private _updateReminderCount(value: string): void {
    const dialog = this._dialog;
    if (!dialog || value.trim() === "") return;

    const parsed = Number(value);
    if (!Number.isInteger(parsed)) return;

    this._setReminderCount(Math.min(12, Math.max(0, parsed)));
  }

  private _setReminderCount(count: number): void {
    const dialog = this._dialog;
    if (!dialog) return;

    const reminders = dialog.reminders.slice(0, count);
    while (reminders.length < count) {
      reminders.push({
        time: this._nextAvailableReminderTime(reminders, count),
        enabled: true,
      });
    }

    this._updateDialog({
      reminders,
      remindersEnabled: count > 0 ? true : dialog.remindersEnabled,
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

    if (!dialog.courseAlways && !this._validDateInput(dialog.courseEndDate)) {
      this._updateDialog({ error: localize(language, "invalidCourseEndDate") });
      return undefined;
    }

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

    if (dialog.courseAlways) {
      if (dialog.mode === "edit") payload.clear_course_end_date = true;
    } else {
      payload.course_end_date = dialog.courseEndDate;
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

  private _validDateInput(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  private _nextAvailableReminderTime(
    reminders: Reminder[],
    targetCount = reminders.length + 1,
  ): string {
    const used = new Set(reminders.map((reminder) => reminder.time));
    for (const time of this._defaultReminderTimes(targetCount)) {
      if (!used.has(time)) return time;
    }
    for (let hour = 0; hour < 24; hour += 1) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      if (!used.has(time)) return time;
    }
    return "08:00";
  }

  private _defaultReminderTimes(count: number): string[] {
    if (count <= 1) return ["08:00"];
    if (count === 2) return ["08:00", "20:00"];
    if (count === 3) return ["08:00", "12:00", "20:00"];

    return Array.from({ length: count }, (_, index) => {
      const hour = Math.round(8 + (12 * index) / (count - 1));
      return `${hour.toString().padStart(2, "0")}:00`;
    });
  }

  private _plannedDailyDoseCount(item: MedicationDashboardItem): number {
    const configured = item.schedule.length;
    const enabled = item.schedule.filter((reminder) => reminder.enabled).length;
    return Math.max(1, enabled || configured);
  }

  private _dayDoseCount(item: MedicationDashboardItem, day: WeeklyDay): number {
    const plannedCount = this._plannedDailyDoseCount(item);
    if (day.is_future) return plannedCount;
    return Math.max(plannedCount, this._historyCount(day));
  }

  private _doseGridStyle(doseCount: number): string {
    const columns = Math.min(2, Math.max(1, doseCount));
    const iconSize = 15;
    const gap = 2;
    const width = columns * iconSize + (columns - 1) * gap;
    return `--dose-columns:${columns};--dose-icon-size:${iconSize}px;--dose-grid-width:${width}px;`;
  }

  private _historyCount(day: WeeklyDay): number {
    return day.taken_count + day.late_count + day.missed_count;
  }

  private _weeklyTitle(
    day: WeeklyDay,
    statusLabel: string,
    language: string,
  ): string {
    const parts = [
      [day.taken_count, localize(language, "taken")],
      [day.late_count, localize(language, "late")],
      [day.missed_count, localize(language, "missed")],
    ]
      .filter(([count]) => Number(count) > 0)
      .map(([count, label]) => `${count} ${label}`);

    const detail = parts.length ? `: ${parts.join(", ")}` : `: ${statusLabel}`;
    return `${this._formatDate(day.date)}${detail}`;
  }

  private _formatDate(value: string): string {
    const parsed = this._parseDateParts(value);
    if (parsed) {
      return `${parsed.day}.${parsed.month}.${parsed.year}`;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return this._formatDateObject(date);
  }

  private _formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${this._formatDateObject(date)} ${this._pad(
      date.getHours(),
    )}:${this._pad(date.getMinutes())}`;
  }

  private _formatDateObject(date: Date): string {
    return `${this._pad(date.getDate())}.${this._pad(
      date.getMonth() + 1,
    )}.${date.getFullYear()}`;
  }

  private _parseDateParts(
    value: string,
  ): { day: string; month: string; year: string } | undefined {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!match) return undefined;
    const [, year, month, day] = match;
    if (!year || !month || !day) return undefined;
    return { day, month, year };
  }

  private _courseEnded(item: MedicationDashboardItem): boolean {
    if (!item.course_end_date) return false;
    return item.course_end_date < this._todayIsoDate();
  }

  private _todayIsoDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${this._pad(today.getMonth() + 1)}-${this._pad(
      today.getDate(),
    )}`;
  }

  private _openMonthlyHistory(item: MedicationDashboardItem): void {
    this._historyMedicationId = item.id;
  }

  private _closeMonthlyHistory(): void {
    this._historyMedicationId = undefined;
  }

  private _historyMedication(): MedicationDashboardItem | undefined {
    return this._dashboard?.medications.find(
      (item) => item.id === this._historyMedicationId,
    );
  }

  private _monthLeadingBlankCount(days: WeeklyDay[]): number {
    const first = days[0];
    if (!first) return 0;
    const date = this._dateFromIsoDate(first.date);
    if (!date) return 0;
    return (date.getDay() + 6) % 7;
  }

  private _monthLabel(value: string | undefined, language: string): string {
    const date = value ? this._dateFromIsoDate(value) : undefined;
    if (!date) return localize(language, "monthlyHistory");
    return date.toLocaleDateString(language, {
      month: "long",
      year: "numeric",
    });
  }

  private _weekdayLabels(): string[] {
    return ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  }

  private _dayNumber(value: string): string {
    const parsed = this._parseDateParts(value);
    if (!parsed) return value;
    return String(Number(parsed.day));
  }

  private _dateFromIsoDate(value: string): Date | undefined {
    const parsed = this._parseDateParts(value);
    if (!parsed) return undefined;
    return new Date(Number(parsed.year), Number(parsed.month) - 1, Number(parsed.day));
  }

  private _pad(value: number): string {
    return value.toString().padStart(2, "0");
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
      grid-template-columns: 40px 1fr 40px 40px 40px;
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

    .week-day {
      align-items: center;
      background: var(--secondary-background-color);
      border-radius: 6px;
      box-sizing: border-box;
      display: grid;
      gap: 5px;
      line-height: 1;
      min-height: 64px;
      min-width: 0;
      padding: 6px 4px;
      place-items: center;
    }

    .week-date {
      color: var(--secondary-text-color);
      font-size: 9px;
      line-height: 10px;
      min-width: 0;
      overflow-wrap: anywhere;
      text-align: center;
      white-space: normal;
      width: 100%;
    }

    .week-doses {
      align-content: center;
      align-items: center;
      display: grid;
      gap: 2px;
      grid-auto-rows: var(--dose-icon-size, 15px);
      grid-template-columns: repeat(
        var(--dose-columns, 1),
        var(--dose-icon-size, 15px)
      );
      justify-content: center;
      justify-items: center;
      margin-inline: auto;
      max-width: min(100%, var(--dose-grid-width, 15px));
      min-height: var(--dose-icon-size, 15px);
      min-width: 0;
      overflow: hidden;
      width: min(100%, var(--dose-grid-width, 15px));
    }

    .dose {
      align-items: center;
      border-radius: 50%;
      box-sizing: border-box;
      display: inline-flex;
      height: 6px;
      justify-content: center;
      justify-self: center;
      min-width: 0;
      width: 6px;
    }

    .dose:nth-last-child(1):nth-child(odd) {
      grid-column: 1 / -1;
    }

    .week-day.taken {
      background: color-mix(in srgb, var(--success-color) 20%, transparent);
    }

    .week-day.late {
      background: color-mix(in srgb, #f5c542 24%, transparent);
    }

    .week-day.missed,
    .week-day.none {
      background: color-mix(in srgb, var(--error-color) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--error-color) 22%, transparent);
    }

    .week-day.future {
      background: transparent;
      border: 1px dashed var(--divider-color);
    }

    .dose.taken {
      background: transparent;
      border-radius: 0;
      color: var(--success-color);
      height: var(--dose-icon-size, 15px);
      overflow: visible;
      width: var(--dose-icon-size, 15px);
    }

    .dose-icon {
      --iron-icon-height: var(--dose-icon-size, 15px);
      --iron-icon-width: var(--dose-icon-size, 15px);
      --mdc-icon-size: var(--dose-icon-size, 15px);
      display: block;
      font-size: var(--dose-icon-size, 15px);
      height: var(--dose-icon-size, 15px);
      line-height: var(--dose-icon-size, 15px);
      width: var(--dose-icon-size, 15px);
    }

    .dose.late {
      background: #f5c542;
    }

    .dose.missed {
      background: var(--error-color);
    }

    .dose.empty {
      background: transparent;
      border: 1px solid var(--divider-color);
    }

    .dose.future {
      background: transparent;
      border: 1px dashed var(--divider-color);
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
      max-width: 100%;
      overflow-x: hidden;
      padding-top: 4px;
    }

    .history-dialog {
      min-width: 0;
      width: min(620px, calc(100vw - 72px));
    }

    .month-title {
      font-size: 15px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .month-grid {
      box-sizing: border-box;
      display: grid;
      gap: 6px;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      min-width: 0;
      width: 100%;
    }

    .month-weekday {
      color: var(--secondary-text-color);
      font-size: 11px;
      line-height: 14px;
      text-align: center;
    }

    .month-spacer {
      min-height: 48px;
    }

    .month-day {
      align-items: center;
      background: var(--secondary-background-color);
      border-radius: 6px;
      box-sizing: border-box;
      display: grid;
      gap: 4px;
      min-height: 48px;
      min-width: 0;
      padding: 5px 3px;
      place-items: center;
    }

    .month-date {
      color: var(--secondary-text-color);
      font-size: 11px;
      line-height: 12px;
    }

    .month-day.taken {
      background: color-mix(in srgb, var(--success-color) 20%, transparent);
    }

    .month-day.late {
      background: color-mix(in srgb, #f5c542 24%, transparent);
    }

    .month-day.missed,
    .month-day.none {
      background: color-mix(in srgb, var(--error-color) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--error-color) 18%, transparent);
    }

    .month-day.future {
      background: transparent;
      border: 1px dashed var(--divider-color);
    }

    .month-doses {
      max-width: min(100%, var(--dose-grid-width, 15px));
      min-height: var(--dose-icon-size, 15px);
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

    .text-field input[type="date"],
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

    .reminder-count {
      max-width: 180px;
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
      ha-dialog {
        --ha-dialog-width-md: calc(100vw - 24px);
      }

      header {
        align-items: stretch;
        flex-direction: column;
      }

      .history-dialog {
        width: min(100%, calc(100vw - 40px));
      }

      .month-grid {
        gap: 4px;
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
