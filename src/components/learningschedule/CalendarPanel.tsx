// src/components/CalendarPanel.tsx
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DaySelector from "@/components/learningschedule/DaySelector";
import { NormalizedEvent } from "@/utils/learningSchedule";

type DayWithDate = { label: string; date: Date };

type Props = {
  weekNumber: number;
  weekStartDate: Date;
  daysWithDates: DayWithDate[];
  eventsInWeek: NormalizedEvent[];
  todayIndex: number;
  isMobile: boolean;
  mobileDefaultIndex: number;
  layoutTopHeight: (ev: NormalizedEvent) => { top: number; height: number };
  setSelectedEvent: (ev: NormalizedEvent) => void;
  currentIndicatorTop: number;
  showCurrentIndicator: boolean;
  fitToWidth: boolean;
  setFitToWidth: (b: boolean) => void;
  prevWeek: () => void;
  nextWeek: () => void;
};

export default function CalendarPanel({
  weekNumber,
  weekStartDate,
  daysWithDates,
  eventsInWeek,
  todayIndex,
  isMobile,
  mobileDefaultIndex,
  layoutTopHeight,
  setSelectedEvent,
  currentIndicatorTop,
  showCurrentIndicator,
  fitToWidth,
  setFitToWidth,
  prevWeek,
  nextWeek,
}: Props) {
  const [mobileDayIndex, setMobileDayIndex] = useState<number>(mobileDefaultIndex);

  // day -> events map memo
  const eventsByDay = useMemo(() => {
    const map: Record<number, NormalizedEvent[]> = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    for (const ev of eventsInWeek) {
      if (ev.dayIndex >= 0 && ev.dayIndex < 7) map[ev.dayIndex].push(ev);
    }
    for (let k = 0; k < 7; k++) {
      map[k].sort((a, b) => (a.startTime && b.startTime ? (a.startTime > b.startTime ? 1 : -1) : 0));
    }
    return map;
  }, [eventsInWeek]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Lịch học tuần {weekNumber} (bắt đầu {weekStartDate.toLocaleDateString()})</h2>
          <div className="text-sm text-muted-foreground">Số môn học tuần này: <span className="font-medium">{eventsInWeek.length}</span></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <Button size="sm" onClick={prevWeek}>‹ Tuần trước</Button>
            <Button size="sm" onClick={nextWeek}>Tuần sau ›</Button>
          </div>

          <div className="text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={fitToWidth} onChange={(e) => setFitToWidth(e.target.checked)} /> Fit</label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative overflow-hidden">
        <div className="flex gap-3">
          {/* time column hidden on mobile */}
          <div className="hidden sm:block w-14 text-xs text-right pr-2 select-none">
            {Array.from({ length: Math.ceil((20 * 60 - 7 * 60) / 60) + 1 }).map((_, i) => (
              <div key={i} style={{ height: 60 }} className="text-[11px] text-muted-foreground">{String(7 + i).padStart(2, "0")}:00</div>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            {isMobile ? (
              <>
                <DaySelector days={daysWithDates} activeIndex={mobileDayIndex} onSelect={setMobileDayIndex} todayIndex={todayIndex} />
                <div className="relative px-2">
                  <div className="relative border rounded-md min-h-[780px]">
                    {Array.from({ length: Math.ceil((20 * 60 - 7 * 60) / 60) }).map((_, i) => (
                      <div key={i} className="w-full border-t opacity-5" style={{ position: "absolute", top: i * 60, left: 0, right: 0 }} />
                    ))}

                    {eventsByDay[mobileDayIndex].map(ev => {
                      const { top, height } = layoutTopHeight(ev);
                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="absolute left-2 right-2 rounded-md p-3 shadow-md cursor-pointer"
                          style={{ top: top + "px", height: height + "px", background: ev.color || undefined }}
                        >
                          <div className="text-sm font-semibold leading-tight">{ev.code}</div>
                          <div className="text-[13px] leading-tight truncate">{ev.title}</div>
                          <div className="text-[12px] mt-1">{ev.startTime ?? "--"} - {ev.endTime ?? "--"} · {ev.room ?? "Phòng?"}</div>
                          <div className="text-[12px]">{ev.teacher ?? "Giảng viên chưa biết"}</div>
                        </div>
                      );
                    })}

                    {showCurrentIndicator && (
                      <div style={{ position: "absolute", left: 0, right: 0, top: currentIndicatorTop + "px", pointerEvents: "none" }}>
                        <div style={{ height: 3, background: "linear-gradient(90deg,#ff4d4f,#ff7a7a)", boxShadow: "0 0 6px rgba(255,77,79,0.6)" }} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="grid gap-2" style={{ gridTemplateColumns: fitToWidth ? "repeat(7,1fr)" : "repeat(7,minmax(160px,1fr))" }}>
                {daysWithDates.map((d, di) => (
                  <div key={d.label} className="relative border rounded-md" style={{ minHeight: 780, background: di === todayIndex ? "linear-gradient(0deg, rgba(255,245,200,0.6), rgba(255,245,200,0.2))" : undefined }}>
                    <div className="sticky top-0 bg-white p-2 border-b flex items-center justify-between">
                      <div className="text-sm font-medium">{d.label}</div>
                      <div className="text-xs text-muted-foreground">{d.date.toLocaleDateString()}</div>
                    </div>

                    <div className="relative">
                      {Array.from({ length: Math.ceil((20 * 60 - 7 * 60) / 60) }).map((_, i) => (
                        <div key={i} className="w-full border-t" style={{ position: "absolute", top: i * 60, left: 0, right: 0, opacity: 0.06 }} />
                      ))}

                      {eventsByDay[di].map(ev => {
                        const { top, height } = layoutTopHeight(ev);
                        return (
                          <div
                            key={ev.id}
                            className="absolute left-3 right-3 rounded-md p-2 shadow-inner cursor-pointer overflow-hidden"
                            style={{ top: top + "px", height: height + "px", background: ev.color || undefined }}
                            onClick={() => setSelectedEvent(ev)}
                            title={`${ev.code} — ${ev.title}`}
                          >
                            <div className="text-sm font-semibold truncate">{ev.code}</div>
                            <div className="text-sm font-semibold truncate">{ev.title}</div>
                            <div className="text-[12px] truncate">{ev.startTime ?? "-"} - {ev.endTime ?? "-"}</div>
                            <div className="text-[12px] truncate">{ev.room ?? "Phòng?"}</div>
                            <div className="text-[12px] truncate">{ev.teacher ?? "Giảng viên chưa biết"}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {showCurrentIndicator && (
                  <div style={{ position: "absolute", left: "14px", right: "8px", top: currentIndicatorTop + "px", pointerEvents: "none" }}>
                    <div style={{ height: 2, background: "linear-gradient(90deg,#ff4d4f,#ff7a7a)", boxShadow: "0 0 6px rgba(255,77,79,0.6)" }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
