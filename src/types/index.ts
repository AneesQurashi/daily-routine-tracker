export const ACTIVITIES = [
  "Gym / Workout",
  "Agentic AI",
  "Trading",
  "USA Calling",
  "English Language Center",
  "Rest / Break",
] as const;

export type Activity = (typeof ACTIVITIES)[number];

export type TimeSlotStatus = "completed" | "in-progress" | "skipped" | "pending";

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  activity: Activity | "";
  note: string;
  status: TimeSlotStatus;
}

export interface NamazTracker {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface WaterIntake {
  glasses: number;
}

export interface MealsLog {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}

export interface StepCounter {
  steps: number;
  kilometers: number;
}

export interface SleepLog {
  sleptAt: string;
  wokeUpAt: string;
  duration: string;
}

export interface DailyReflection {
  goodDeeds: string;
  mistakes: string;
  newLearnings: string;
}

export interface DailyData {
  date: string;
  timeSlots: TimeSlot[];
  namaz: NamazTracker;
  water: WaterIntake;
  meals: MealsLog;
  steps: StepCounter;
  sleep: SleepLog;
  reflection: DailyReflection;
}

export const TIME_SLOTS = [
  { id: "1", startTime: "06:00", endTime: "08:00" },
  { id: "2", startTime: "08:00", endTime: "10:00" },
  { id: "3", startTime: "10:00", endTime: "12:00" },
  { id: "4", startTime: "12:00", endTime: "14:00" },
  { id: "5", startTime: "14:00", endTime: "16:00" },
  { id: "6", startTime: "16:00", endTime: "18:00" },
  { id: "7", startTime: "18:00", endTime: "20:00" },
  { id: "8", startTime: "20:00", endTime: "22:00" },
  { id: "9", startTime: "22:00", endTime: "00:00" },
] as const;

export const NAMAZ_NAMES = [
  { key: "fajr", label: "Fajr", icon: "sunrise" },
  { key: "dhuhr", label: "Dhuhr", icon: "sun" },
  { key: "asr", label: "Asr", icon: "sun" },
  { key: "maghrib", label: "Maghrib", icon: "sunset" },
  { key: "isha", label: "Isha", icon: "moon" },
] as const;

export const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast", icon: "coffee" },
  { key: "lunch", label: "Lunch", icon: "utensils" },
  { key: "dinner", label: "Dinner", icon: "utensils" },
  { key: "snacks", label: "Snacks", icon: "cookie" },
] as const;