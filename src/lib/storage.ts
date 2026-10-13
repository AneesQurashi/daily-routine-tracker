import type { DailyData, TimeSlot, NamazTracker, WaterIntake, MealsLog, StepCounter, SleepLog, DailyReflection } from "@/types";
import { TIME_SLOTS } from "@/types";

const STORAGE_PREFIX = "daily-routine-tracker";

const DEFAULT_NAMAZ: NamazTracker = {
  fajr: false,
  dhuhr: false,
  asr: false,
  maghrib: false,
  isha: false,
};

const DEFAULT_WATER: WaterIntake = {
  glasses: 0,
};

const DEFAULT_MEALS: MealsLog = {
  breakfast: "",
  lunch: "",
  dinner: "",
  snacks: "",
};

const DEFAULT_STEPS: StepCounter = {
  steps: 0,
  kilometers: 0,
};

const DEFAULT_SLEEP: SleepLog = {
  sleptAt: "",
  wokeUpAt: "",
  duration: "",
};

const DEFAULT_REFLECTION: DailyReflection = {
  goodDeeds: "",
  mistakes: "",
  newLearnings: "",
};

export function getStorageKey(date: string): string {
  return `${STORAGE_PREFIX}-${date}`;
}

export function getDefaultTimeSlots(): TimeSlot[] {
  return TIME_SLOTS.map((slot) => ({
    id: slot.id,
    startTime: slot.startTime,
    endTime: slot.endTime,
    activity: "",
    note: "",
    status: "pending" as const,
  }));
}

export function getDefaultDailyData(date: string): DailyData {
  return {
    date,
    timeSlots: getDefaultTimeSlots(),
    namaz: DEFAULT_NAMAZ,
    water: DEFAULT_WATER,
    meals: DEFAULT_MEALS,
    steps: DEFAULT_STEPS,
    sleep: DEFAULT_SLEEP,
    reflection: DEFAULT_REFLECTION,
  };
}

export function loadDailyData(date: string): DailyData {
  if (typeof window === "undefined") {
    return getDefaultDailyData(date);
  }
  try {
    const key = getStorageKey(date);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...getDefaultDailyData(date), ...parsed };
    }
  } catch (error) {
    console.error("Failed to load daily data:", error);
  }
  return getDefaultDailyData(date);
}

export function saveDailyData(data: DailyData): void {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(data.date);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save daily data:", error);
  }
}

export function updateTimeSlot(date: string, slotId: string, updates: Partial<TimeSlot>): void {
  const data = loadDailyData(date);
  const slotIndex = data.timeSlots.findIndex((s) => s.id === slotId);
  if (slotIndex !== -1) {
    data.timeSlots[slotIndex] = { ...data.timeSlots[slotIndex], ...updates };
    saveDailyData(data);
  }
}

export function updateNamaz(date: string, prayer: keyof NamazTracker, value: boolean): void {
  const data = loadDailyData(date);
  data.namaz[prayer] = value;
  saveDailyData(data);
}

export function updateWater(date: string, glasses: number): void {
  const data = loadDailyData(date);
  data.water.glasses = Math.max(0, glasses);
  saveDailyData(data);
}

export function updateMeal(date: string, meal: keyof MealsLog, value: string): void {
  const data = loadDailyData(date);
  data.meals[meal] = value;
  saveDailyData(data);
}

export function updateSteps(date: string, steps: number, kilometers: number): void {
  const data = loadDailyData(date);
  data.steps.steps = Math.max(0, steps);
  data.steps.kilometers = Math.max(0, kilometers);
  saveDailyData(data);
}

export function updateSleep(date: string, sleep: Partial<SleepLog>): void {
  const data = loadDailyData(date);
  data.sleep = { ...data.sleep, ...sleep };
  if (data.sleep.sleptAt && data.sleep.wokeUpAt) {
    data.sleep.duration = calculateSleepDuration(data.sleep.sleptAt, data.sleep.wokeUpAt);
  }
  saveDailyData(data);
}

export function updateReflection(date: string, reflection: Partial<DailyReflection>): void {
  const data = loadDailyData(date);
  data.reflection = { ...data.reflection, ...reflection };
  saveDailyData(data);
}

function calculateSleepDuration(sleptAt: string, wokeUpAt: string): string {
  try {
    const [sHours, sMinutes] = sleptAt.split(":").map(Number);
    const [wHours, wMinutes] = wokeUpAt.split(":").map(Number);

    let sleptMinutes = sHours * 60 + sMinutes;
    let wokeMinutes = wHours * 60 + wMinutes;

    if (wokeMinutes <= sleptMinutes) {
      wokeMinutes += 24 * 60;
    }

    const diffMinutes = wokeMinutes - sleptMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
  } catch {
    return "";
  }
}

export function calculateStats(data: DailyData) {
  const completedSlots = data.timeSlots.filter((s) => s.status === "completed").length;
  const totalSlots = data.timeSlots.filter((s) => s.activity !== "").length;
  const completionRate = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  const prayersCompleted = Object.values(data.namaz).filter(Boolean).length;
  const waterGlasses = data.water.glasses;

  return {
    completionRate,
    completedSlots,
    totalSlots,
    prayersCompleted,
    waterGlasses,
  };
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}