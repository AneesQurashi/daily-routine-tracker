"use client";

import { useState, useEffect } from "react";
import { Coffee, Utensils, Cookie, CheckCircle } from "lucide-react";
import type { MealsLog } from "@/types";
import { MEAL_TYPES } from "@/types";
import { updateMeal, loadDailyData } from "@/lib/storage";

interface MealsLogProps {
  date: string;
  onDataChange: () => void;
}

export function MealsLog({ date, onDataChange }: MealsLogProps) {
  const [meals, setMeals] = useState<MealsLog>(() => loadDailyData(date).meals);
  const [saving, setSaving] = useState<keyof MealsLog | null>(null);

  const handleChange = (meal: keyof MealsLog, value: string) => {
    setSaving(meal);
    setMeals((prev) => ({ ...prev, [meal]: value }));
    updateMeal(date, meal, value);
    setTimeout(() => {
      setSaving(null);
      onDataChange();
    }, 100);
  };

  const mealIcons = {
    breakfast: Coffee,
    lunch: Utensils,
    dinner: Utensils,
    snacks: Cookie,
  };

  return (
    <div className="card p-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <Utensils className="w-5 h-5 text-emerald-500" />
        Meals Log
      </h3>

      <div className="space-y-3">
        {MEAL_TYPES.map(({ key, label, icon: iconName }) => {
          const Icon = mealIcons[key as keyof typeof mealIcons];
          const hasContent = meals[key].trim().length > 0;

          return (
            <div key={key} className={`rounded-lg p-3 transition-all duration-200 ${
              hasContent ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-slate-800/50 border border-slate-700"
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  hasContent ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-700 text-slate-500"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-white">{label}</span>
                {hasContent && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />
                )}
              </div>
              <input
                type="text"
                value={meals[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={`What did you have for ${label.toLowerCase()}?`}
                className="input-field bg-slate-950/50"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}