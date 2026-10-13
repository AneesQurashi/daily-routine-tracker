"use client";

import { useState, useEffect } from "react";
import { Footprints, Target, RefreshCw } from "lucide-react";
import type { StepCounter } from "@/types";
import { updateSteps, loadDailyData } from "@/lib/storage";

interface StepCounterProps {
  date: string;
  onDataChange: () => void;
}

export function StepCounter({ date, onDataChange }: StepCounterProps) {
  const [steps, setSteps] = useState(() => loadDailyData(date).steps.steps);
  const [kilometers, setKilometers] = useState(() => loadDailyData(date).steps.kilometers);
  const [saving, setSaving] = useState(false);

  const STEPS_PER_KM = 1300;
  const DAILY_GOAL = 10000;

  const handleStepsChange = (value: number) => {
    const clamped = Math.max(0, value);
    setSteps(clamped);
    setKilometers(Math.round((clamped / STEPS_PER_KM) * 100) / 100);
    setSaving(true);
    updateSteps(date, clamped, Math.round((clamped / STEPS_PER_KM) * 100) / 100);
    setTimeout(() => {
      setSaving(false);
      onDataChange();
    }, 100);
  };

  const handleKmChange = (value: number) => {
    const clamped = Math.max(0, value);
    setKilometers(clamped);
    setSteps(Math.round(clamped * STEPS_PER_KM));
    setSaving(true);
    updateSteps(date, Math.round(clamped * STEPS_PER_KM), clamped);
    setTimeout(() => {
      setSaving(false);
      onDataChange();
    }, 100);
  };

  const quickAddSteps = (amount: number) => {
    handleStepsChange(steps + amount);
  };

  const percentage = Math.min((steps / DAILY_GOAL) * 100, 100);

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Footprints className="w-5 h-5 text-sky-500" />
          Steps / Walk
        </h3>
        <span className="badge bg-sky-500/20 text-sky-400 text-base px-3 py-1">
          {steps.toLocaleString()} steps
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1">Steps</label>
            <div className="relative">
              <input
                type="number"
                value={steps}
                onChange={(e) => handleStepsChange(parseInt(e.target.value) || 0)}
                className="input-field pr-16"
                min="0"
                disabled={saving}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1">Kilometers</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={kilometers}
                onChange={(e) => handleKmChange(parseFloat(e.target.value) || 0)}
                className="input-field pr-16"
                min="0"
                disabled={saving}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
              </span>
            </div>
          </div>
        </div>

        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs text-center">{Math.round(percentage)}% of {DAILY_GOAL.toLocaleString()} steps goal</p>

        <div className="grid grid-cols-3 gap-2">
          {[1000, 2000, 5000].map((amount) => (
            <button
              key={amount}
              onClick={() => quickAddSteps(amount)}
              className="btn-secondary text-sm py-2 transition-all duration-200 hover:bg-sky-500/20 hover:border-sky-500/30 border border-slate-700"
            >
              +{amount.toLocaleString()} steps
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 text-slate-500 text-sm">
          <Target className="w-4 h-4" />
          <span>≈ {kilometers.toFixed(1)} km walked</span>
        </div>
      </div>
    </div>
  );
}