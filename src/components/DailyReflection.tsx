"use client";

import { useState, useEffect } from "react";
import { Star, AlertTriangle, Lightbulb, Save, Check } from "lucide-react";
import type { DailyReflection } from "@/types";
import { updateReflection, loadDailyData } from "@/lib/storage";

interface DailyReflectionProps {
  date: string;
  onDataChange: () => void;
}

const REFLECTION_FIELDS = [
  {
    key: "goodDeeds",
    label: "Good Deeds / Wins",
    placeholder: "What positive things did you do today?",
    icon: Star,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    key: "mistakes",
    label: "Mistakes / Regrets",
    placeholder: "What wrong/bad things did you do today?",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  {
    key: "newLearnings",
    label: "New Learnings",
    placeholder: "What new skill or concept did you learn today?",
    icon: Lightbulb,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10 border-sky-500/20",
  },
] as const;

export function DailyReflection({ date, onDataChange }: DailyReflectionProps) {
  const [reflection, setReflection] = useState<DailyReflection>(() => loadDailyData(date).reflection);
  const [saving, setSaving] = useState<keyof DailyReflection | null>(null);
  const [saved, setSaved] = useState<keyof DailyReflection | null>(null);

  const handleChange = (field: keyof DailyReflection, value: string) => {
    setReflection((prev) => ({ ...prev, [field]: value }));
    setSaved(null);
  };

  const handleSave = (field: keyof DailyReflection) => {
    setSaving(field);
    updateReflection(date, { [field]: reflection[field] });
    setTimeout(() => {
      setSaving(null);
      setSaved(field);
      onDataChange();
      setTimeout(() => setSaved(null), 2000);
    }, 100);
  };

  return (
    <div className="card p-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        Daily Reflection (Self-Audit)
      </h3>

      <div className="space-y-4">
        {REFLECTION_FIELDS.map(({ key, label, placeholder, icon: Icon, color, bgColor }) => {
          const value = reflection[key];
          const hasContent = value.trim().length > 0;
          const isSaving = saving === key;
          const isSaved = saved === key;

          return (
            <div
              key={key}
              className={`rounded-xl p-4 transition-all duration-300 border ${
                hasContent ? bgColor : "bg-slate-800/50 border-slate-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color.replace("text", "bg")}/20`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    {label}
                    {hasContent && (
                      <span className={`badge ${color.replace("text-", "bg-")}/20 ${color.replace("text-", "text-")}`}>
                        {isSaved ? "Saved" : isSaving ? "Saving..." : "✓"}
                      </span>
                    )}
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className={`input-field resize-none transition-all duration-200 ${
                      hasContent ? "bg-slate-900/50" : "bg-slate-950/50"
                    }`}
                    disabled={isSaving}
                  />
                  {hasContent && (
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleSave(key)}
                        disabled={isSaving}
                        className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1.5"
                      >
                        {isSaving ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                            Saving...
                          </>
                        ) : isSaved ? (
                          <>
                            <Check className="w-4 h-4" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}