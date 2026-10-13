"use client";

import { useState, useEffect } from "react";
import { Droplets, Plus, Minus } from "lucide-react";
import type { WaterIntake } from "@/types";
import { updateWater, loadDailyData } from "@/lib/storage";

interface WaterIntakeProps {
  date: string;
  onDataChange: () => void;
}

export function WaterIntake({ date, onDataChange }: WaterIntakeProps) {
  const [glasses, setGlasses] = useState(() => loadDailyData(date).water.glasses);

  const handleIncrement = () => {
    const newValue = glasses + 1;
    setGlasses(newValue);
    updateWater(date, newValue);
    onDataChange();
  };

  const handleDecrement = () => {
    const newValue = Math.max(0, glasses - 1);
    setGlasses(newValue);
    updateWater(date, newValue);
    onDataChange();
  };

  const handleQuickAdd = (amount: number) => {
    const newValue = glasses + amount;
    setGlasses(newValue);
    updateWater(date, newValue);
    onDataChange();
  };

  const percentage = Math.min((glasses / 8) * 100, 100);

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Droplets className="w-5 h-5 text-sky-500" />
          Water Intake
        </h3>
        <span className="badge bg-sky-500/20 text-sky-400 text-base px-3 py-1">
          {glasses} glasses
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleDecrement}
            disabled={glasses === 0}
            className="btn-secondary w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50"
            aria-label="Decrease water intake"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-4xl font-bold text-white tabular-nums">{glasses}</span>
            <p className="text-slate-500 text-sm mt-1">glasses today</p>
          </div>
          <button
            onClick={handleIncrement}
            className="btn-primary w-12 h-12 rounded-xl flex items-center justify-center"
            aria-label="Increase water intake"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs text-center">{Math.round(percentage)}% of 8 glasses goal</p>

        <div className="grid grid-cols-3 gap-2 pt-2">
          {[1, 2, 3].map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickAdd(amount)}
              className="btn-secondary text-sm py-2 transition-all duration-200 hover:bg-sky-500/20 hover:border-sky-500/30 border border-slate-700"
            >
              +{amount} glass{amount > 1 ? "es" : ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}