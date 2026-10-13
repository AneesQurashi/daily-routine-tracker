"use client";

import { ChevronLeft, ChevronRight, Calendar, Home } from "lucide-react";
import { formatDisplayDate, addDays, isToday, formatDate } from "@/lib/storage";

interface DateNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onTodayClick: () => void;
}

export function DateNavigation({ currentDate, onDateChange, onTodayClick }: DateNavigationProps) {
  const handlePrev = () => {
    onDateChange(addDays(currentDate, -1));
  };

  const handleNext = () => {
    onDateChange(addDays(currentDate, 1));
  };

  const handleToday = () => {
    onTodayClick();
  };

  return (
    <div className="card p-3 mb-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="btn-ghost p-2 rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-200 hover:bg-slate-800"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-2 px-4">
          <button
            onClick={handleToday}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              isToday(currentDate)
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {formatDisplayDate(currentDate)}
            </span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="btn-ghost p-2 rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-200 hover:bg-slate-800"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {!isToday(currentDate) && (
        <button
          onClick={handleToday}
          className="w-full btn-secondary text-sm flex items-center justify-center gap-2 mt-2"
        >
          <Home className="w-4 h-4" />
          Go to Today
        </button>
      )}
    </div>
  );
}