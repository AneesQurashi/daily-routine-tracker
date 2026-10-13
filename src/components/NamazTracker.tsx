"use client";

import { useState, useEffect } from "react";
import { Sunrise, Sun, Sunset, Moon, CheckCheck } from "lucide-react";
import type { NamazTracker } from "@/types";
import { NAMAZ_NAMES } from "@/types";
import { updateNamaz, loadDailyData } from "@/lib/storage";

interface NamazTrackerProps {
  date: string;
  onDataChange: () => void;
}

export function NamazTracker({ date, onDataChange }: NamazTrackerProps) {
  const [namaz, setNamaz] = useState<NamazTracker>(() => loadDailyData(date).namaz);
  const [animating, setAnimating] = useState<string | null>(null);

  const prayersCompleted = Object.values(namaz).filter(Boolean).length;

  const handleToggle = (prayer: keyof NamazTracker) => {
    setAnimating(prayer);
    const newValue = !namaz[prayer];
    updateNamaz(date, prayer, newValue);
    setNamaz((prev) => ({ ...prev, [prayer]: newValue }));
    setTimeout(() => {
      setAnimating(null);
      onDataChange();
    }, 300);
  };

  const prayerIcons = {
    fajr: Sunrise,
    dhuhr: Sun,
    asr: Sun,
    maghrib: Sunset,
    isha: Moon,
  };

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <CheckCheck className="w-5 h-5 text-emerald-500" />
          Namaz Tracker
        </h3>
        <span className="badge bg-emerald-500/20 text-emerald-400 text-base px-3 py-1">
          {prayersCompleted}/5
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {NAMAZ_NAMES.map(({ key, label, icon: iconName }) => {
          const Icon = prayerIcons[key as keyof typeof prayerIcons];
          const isCompleted = namaz[key as keyof NamazTracker];
          const isAnimating = animating === key;

          return (
            <button
              key={key}
              onClick={() => handleToggle(key as keyof NamazTracker)}
              className={`relative p-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 ${
                isCompleted
                  ? "bg-emerald-500/15 border border-emerald-500/30"
                  : "bg-slate-800/50 border border-slate-700 hover:border-slate-600"
              } ${isAnimating ? "animate-pulse" : ""}`}
              disabled={isAnimating}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-all duration-300 ${
                    isCompleted ? "text-emerald-500" : "text-slate-500"
                  } ${isAnimating ? "animate-spin scale-125" : ""}`}
                />
                {isCompleted && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCheck className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium ${isCompleted ? "text-emerald-400" : "text-slate-400"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}