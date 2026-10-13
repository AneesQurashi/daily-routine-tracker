"use client";

import { useState } from "react";
import { MoreVertical, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import type { TimeSlot, Activity } from "@/types";
import { ACTIVITIES, TIME_SLOTS } from "@/types";
import { updateTimeSlot, loadDailyData } from "@/lib/storage";

interface TimeBlockScheduleProps {
  date: string;
  onDataChange: () => void;
}

export function TimeBlockSchedule({ date, onDataChange }: TimeBlockScheduleProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => loadDailyData(date).timeSlots);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<Set<string>>(new Set());

  const handleActivityChange = (slotId: string, activity: Activity | "") => {
    setLoadingSlots((prev) => new Set(prev).add(slotId));
    updateTimeSlot(date, slotId, { activity });
    setTimeSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, activity } : slot))
    );
    setTimeout(() => {
      setLoadingSlots((prev) => {
        const next = new Set(prev);
        next.delete(slotId);
        return next;
      });
      onDataChange();
    }, 100);
  };

  const handleNoteChange = (slotId: string, note: string) => {
    updateTimeSlot(date, slotId, { note });
    setTimeSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, note } : slot))
    );
  };

  const handleStatusChange = (slotId: string, status: TimeSlot["status"]) => {
    setLoadingSlots((prev) => new Set(prev).add(slotId));
    updateTimeSlot(date, slotId, { status });
    setTimeSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, status } : slot))
    );
    setTimeout(() => {
      setLoadingSlots((prev) => {
        const next = new Set(prev);
        next.delete(slotId);
        return next;
      });
      onDataChange();
    }, 100);
  };

  const toggleExpand = (slotId: string) => {
    setExpandedSlot((prev) => (prev === slotId ? null : slotId));
  };

  const getStatusIcon = (status: TimeSlot["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "in-progress":
        return <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />;
      case "skipped":
        return <XCircle className="w-5 h-5 text-slate-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: TimeSlot["status"]) => {
    const badges = {
      completed: "badge badge-completed",
      "in-progress": "badge badge-inprogress",
      skipped: "badge badge-skipped",
      pending: "badge bg-slate-800 text-slate-500",
    };
    const labels = {
      completed: "Completed",
      "in-progress": "In Progress",
      skipped: "Skipped",
      pending: "Pending",
    };
    return (
      <span className={badges[status]}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {TIME_SLOTS.map((slotConfig) => {
        const slot = timeSlots.find((s) => s.id === slotConfig.id);
        if (!slot) return null;
        const isExpanded = expandedSlot === slot.id;
        const isLoading = loadingSlots.has(slot.id);

        return (
          <div
            key={slot.id}
            className={`card card-hover relative overflow-hidden ${isExpanded ? "rounded-xl" : "rounded-xl"}`}
            style={{ borderLeft: `3px solid ${slot.activity ? (slot.status === "completed" ? "#10b981" : slot.status === "in-progress" ? "#0ea5e9" : "#64748b") : "transparent"}` }}
          >
            <button
              onClick={() => toggleExpand(slot.id)}
              className="w-full p-4 flex items-center gap-3 text-left"
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-3 min-w-[80px]">
                <span className="text-slate-500 text-sm font-mono w-14 text-right">
                  {slot.startTime}
                </span>
                <div className="w-px h-8 bg-slate-700" />
                <span className="text-slate-500 text-sm font-mono">
                  {slot.endTime}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white truncate">
                    {slot.activity || "No activity selected"}
                  </span>
                  {slot.activity && getStatusBadge(slot.status)}
                </div>
                {slot.note && (
                  <p className="text-slate-400 text-sm mt-1 truncate">{slot.note}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(slot.status)}
                <MoreVertical className="text-slate-500 transition-transform duration-200" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-0 animate-slide-up border-t border-slate-800">
                <div className="space-y-3">
                  <label className="block text-slate-400 text-xs font-medium mb-1">Activity</label>
                  <select
                    value={slot.activity}
                    onChange={(e) => handleActivityChange(slot.id, e.target.value as Activity | "")}
                    className="select-field"
                    disabled={isLoading}
                  >
                    <option value="">Select activity</option>
                    {ACTIVITIES.map((activity) => (
                      <option key={activity} value={activity}>
                        {activity}
                      </option>
                    ))}
                  </select>

                  <label className="block text-slate-400 text-xs font-medium mb-1">Note</label>
                  <input
                    type="text"
                    value={slot.note}
                    onChange={(e) => handleNoteChange(slot.id, e.target.value)}
                    placeholder="Add a note..."
                    className="input-field"
                  />

                  <label className="block text-slate-400 text-xs font-medium mb-1">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {(["completed", "in-progress", "skipped", "pending"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(slot.id, status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          slot.status === status
                            ? status === "completed"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : status === "in-progress"
                              ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                              : status === "skipped"
                              ? "bg-slate-600 text-slate-400 border border-slate-600"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                            : "bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600"
                        }`}
                        disabled={isLoading}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}