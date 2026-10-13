"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateNavigation } from "@/components/DateNavigation";
import { TimeBlockSchedule } from "@/components/TimeBlockSchedule";
import { QuickStatsHeader } from "@/components/QuickStatsHeader";
import { NamazTracker } from "@/components/NamazTracker";
import { WaterIntake } from "@/components/WaterIntake";
import { MealsLog } from "@/components/MealsLog";
import { StepCounter } from "@/components/StepCounter";
import { SleepLog } from "@/components/SleepLog";
import { DailyReflection } from "@/components/DailyReflection";
import { formatDate, addDays, isToday, loadDailyData, calculateStats } from "@/lib/storage";
import type { DailyData } from "@/types";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [dailyData, setDailyData] = useState<DailyData>(() => loadDailyData(formatDate(new Date())));
  const [activeTab, setActiveTab] = useState<"schedule" | "reflection">("schedule");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const data = loadDailyData(formatDate(currentDate));
    setDailyData(data);
  }, [currentDate]);

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
    setActiveTab("schedule");
  }, []);

  const handleTodayClick = useCallback(() => {
    setCurrentDate(new Date());
    setActiveTab("schedule");
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as "schedule" | "reflection");
  }, []);

  const handleDataChange = useCallback(() => {
    const data = loadDailyData(formatDate(currentDate));
    setDailyData(data);
  }, [currentDate]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = calculateStats(dailyData);

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <DateNavigation
          currentDate={currentDate}
          onDateChange={handleDateChange}
          onTodayClick={handleTodayClick}
        />

        <QuickStatsHeader data={dailyData} />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-800 rounded-xl p-1 mb-4">
            <TabsTrigger value="schedule" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border data-[state=active]:border-emerald-500/30">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="reflection" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400 data-[state=active]:border data-[state=active]:border-sky-500/30">
              Reflection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4 animate-fade-in">
            <TimeBlockSchedule date={formatDate(currentDate)} onDataChange={handleDataChange} />
          </TabsContent>

          <TabsContent value="reflection" className="space-y-4 animate-fade-in">
            <NamazTracker date={formatDate(currentDate)} onDataChange={handleDataChange} />
            <WaterIntake date={formatDate(currentDate)} onDataChange={handleDataChange} />
            <MealsLog date={formatDate(currentDate)} onDataChange={handleDataChange} />
            <StepCounter date={formatDate(currentDate)} onDataChange={handleDataChange} />
            <SleepLog date={formatDate(currentDate)} onDataChange={handleDataChange} />
            <DailyReflection date={formatDate(currentDate)} onDataChange={handleDataChange} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-4 text-slate-500 text-xs">
          <span>Completion: {stats.completionRate}%</span>
          <span className="w-px h-4 bg-slate-700" />
          <span>Prayers: {stats.prayersCompleted}/5</span>
          <span className="w-px h-4 bg-slate-700" />
          <span>Water: {stats.waterGlasses}/8</span>
        </div>
      </div>
    </div>
  );
}