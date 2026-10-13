"use client";

import { CheckCircle2, Droplets, Target } from "lucide-react";
import type { DailyData } from "@/types";
import { calculateStats } from "@/lib/storage";

interface QuickStatsHeaderProps {
  data: DailyData;
}

export function QuickStatsHeader({ data }: QuickStatsHeaderProps) {
  const stats = calculateStats(data);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in">
      <div className="card p-4 card-hover relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium">Completion Rate</p>
            <p className="text-2xl font-bold text-white">{stats.completionRate}%</p>
          </div>
        </div>
        <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs mt-1 text-right">
          {stats.completedSlots}/{stats.totalSlots} blocks
        </p>
      </div>

      <div className="card p-4 card-hover relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium">Water Intake</p>
            <p className="text-2xl font-bold text-white">{stats.waterGlasses}/8</p>
          </div>
        </div>
        <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((stats.waterGlasses / 8) * 100, 100)}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs mt-1 text-right">Target: 8 glasses</p>
      </div>

      <div className="card p-4 card-hover relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium">Namaz Completed</p>
            <p className="text-2xl font-bold text-white">{stats.prayersCompleted}/5</p>
          </div>
        </div>
        <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${(stats.prayersCompleted / 5) * 100}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs mt-1 text-right">5 daily prayers</p>
      </div>
    </div>
  );
}