export interface Reminder {
  time: string;
  enabled: boolean;
}

export interface HistoryEntry {
  id: string;
  medication_id: string;
  scheduled_time: string | null;
  taken_time: string;
  status: "taken" | "missed" | "late";
  source: "nfc" | "button" | "notification" | "api";
}

export interface WeeklyDay {
  date: string;
  status: "taken" | "missed" | "late" | null;
  entry_ids: string[];
  taken_count: number;
  late_count: number;
  missed_count: number;
  is_future: boolean;
}

export interface MedicationDashboardItem {
  id: string;
  name: string;
  icon: string;
  tag_id: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  schedule: Reminder[];
  course_end_date: string | null;
  today_status: "taken" | "missed" | "late" | null;
  next_reminder: { time: string; due_at: string } | null;
  last_intake: HistoryEntry | null;
  weekly_history: WeeklyDay[];
  monthly_history: WeeklyDay[];
}

export interface MedicationDashboard {
  config_entry_id: string;
  generated_at: string;
  medications: MedicationDashboardItem[];
}
