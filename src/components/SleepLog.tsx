"use client";

import { useState, useEffect } from "react";
import { Moon, Sunrise, Clock, RefreshCw } from "lucide-react";
import type { SleepLog } from "@/types";
import { updateSleep, loadDailyData } from "@/lib/storage";

interface SleepLogProps {
  date: string;
  onDataChange: () => void;
}

export function SleepLog({ date, onDataChange }: SleepLogProps) {
  const [sleep, setSleep] = useState<SleepLog>(() => loadDailyData(date).sleep);
  const [saving, setSaving] = useState(false);

  const calculateDuration = (sleptAt: string, wokeUpAt: string): string => {
    if (!sleptAt || !wokeUpAt) return "";
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
  };

  const handleChange = (field: keyof SleepLog, value: string) => {
    const newSleep = { ...sleep, [field]: value };
    if (field === "sleptAt" || field === "wokeUpAt") {
      const sleptAt = field === "sleptAt" ? value : sleep.sleptAt;
      const wokeUpAt = field === "wokeUpAt" ? value : sleep.wokeUpAt;
      newSleep.duration = calculateDuration(sleptAt, wokeUpAt);
    }
    setSleep(newSleep);
    setSaving(true);
    updateSleep(date, newSleep);
    setTimeout(() => {
      setSaving(false);
      onDataChange();
    }, 100);
  };

  const formatTimeForDisplay = (time: string): string => {
    if (!time) return "--:--";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Moon className="w-5 h-5 text-sky-500" />
          Sleep Log
        </h3>
        {sleep.duration && (
          <span className="badge bg-sky-500/20 text-sky-400 text-base px-3 py-1">
            {sleep.duration}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`relative ${sleep.sleptAt ? "bg-sky-500/5 border-sky-500/20" : "bg-slate-800/50 border-slate-700"} border rounded-xl p-4 transition-all duration-200`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <Moon className="w-4 h-4 text-sky-500" />
            </div>
            <span className="font-medium text-white">Slept At</span>
          </div>
          <input
            type="time"
            value={sleep.sleptAt}
            onChange={(e) => handleChange("sleptAt", e.target.value)}
            className="input-field w-full text-center text-lg font-mono bg-slate-950/50"
            disabled={saving}
          />
          <p className="text-slate-500 text-xs text-center mt-1">
            {sleep.sleptAt ? formatTimeForDisplay(sleep.sleptAt) : "Tap to set"}
          </p>
        </div>

        <div className={`relative ${sleep.wokeUpAt ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-800/50 border-slate-700"} border rounded-xl p-4 transition-all duration-200`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Sunrise className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="font-medium text-white">Woke Up At</span>
          </div>
          <input
            type="time"
            value={sleep.wokeUpAt}
            onChange={(e) => handleChange("wokeUpAt", e.target.value)}
            className="input-field w-full text-center text-lg font-mono bg-slate-950/50"
            disabled={saving}
          />
          <p className="text-slate-500 text-xs text-center mt-1">
            {sleep.wokeUpAt ? formatTimeForDisplay(sleep.wokeUpAt) : "Tap to set"}
          </p>
        </div>
      </div>

      {sleep.duration && (
        <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-emerald-500" />
            <span className="text-lg font-semibold text-white">
              Total Sleep: <span className="text-emerald-400">{sleep.duration}</span>
            </span>
          </div>
        </div>
      )}

      {(!sleep.sleptAt || !sleep.wokeUpAt) && (
        <p className="text-slate-500 text-xs text-center mt-3">
          Set both times to calculate sleep duration
        </p>
      )}
    </div>
  );
}