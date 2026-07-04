const RU = {
  add: "Добавить",
  addMedication: "Добавить лекарство",
  cancel: "Отмена",
  delete: "Удалить",
  deleteConfirm: "Удалить лекарство?",
  deleteMedication: "Удалить лекарство",
  dailyDoseCount: "Приёмов в день",
  edit: "Изменить",
  editMedication: "Редактировать лекарство",
  empty: "Лекарства не добавлены",
  enableMedication: "Лекарство активно",
  enableReminder: "Напоминание активно",
  enableReminders: "Включить напоминания",
  icon: "Иконка",
  invalidReminder: "Проверьте время напоминаний",
  last: "Последний приём",
  late: "Поздно",
  missed: "Пропущено",
  name: "Название",
  next: "Напоминание",
  noReminders: "Напоминания не добавлены",
  none: "Нет данных",
  nfcTag: "NFC-метка",
  removeReminder: "Удалить напоминание",
  reminderTime: "Время",
  reminders: "Напоминания",
  requiredName: "Введите название лекарства",
  save: "Сохранить",
  take: "Отметить приём",
  taken: "Принято",
  today: "Сегодня",
  title: "Менеджер лекарств",
  unnamed: "Новое лекарство",
};

export type TranslationKey = keyof typeof RU;

export function localize(language: string | undefined, key: TranslationKey): string {
  return RU[key];
}
