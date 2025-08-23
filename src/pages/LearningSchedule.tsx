// src/pages/LearningSchedule.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout";
import ImportPanel from "@/components/learningschedule/ImportPanel";
import CalendarPanel from "@/components/learningschedule/CalendarPanel";
import EventModal from "@/components/learningschedule/EventModal";
import ColorPalette from "@/components/learningschedule/ColorPalette";

import {
  NormalizedEvent,
  normalizeToEvents,
  MappingMode,
  timeToMinutes,
  colorFromString,
  addDays,
  formatDate,
  parseWeekSeries,
  hueFromString,
} from "@/utils/learningSchedule";

import { DAYS, STORAGE_KEY, BASE_WEEK_NUMBER, BASE_WEEK_START, COLORS_STORAGE } from "@/constant";

export default function LearningSchedule(): JSX.Element {
  // --- state (same as before) ---
  const [rawText, setRawText] = useState<string>("");
  const [mappingMode, setMappingMode] = useState<MappingMode>("server_2_is_monday");
  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [noSchedule, setNoSchedule] = useState<NormalizedEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [weekNumber, setWeekNumber] = useState<number>(BASE_WEEK_NUMBER);
  const [colors, setColors] = useState<Record<string, string>>({});

  const [selectedEvent, setSelectedEvent] = useState<NormalizedEvent | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [draggingColor, setDraggingColor] = useState(false);

  const [fitToWidth, setFitToWidth] = useState(true);

  // time display
  const DISPLAY_START_MIN = 7 * 60;
  const DISPLAY_END_MIN = 20 * 60;
  const MIN_EVENT_HEIGHT = 28;
  const PIXELS_PER_MINUTE = 1;

  const [nowMinutes, setNowMinutes] = useState<number>(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNowMinutes(d.getHours() * 60 + d.getMinutes());
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  // responsive helpers (passable down)
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    let t: any = null;
    function onResize() {
      clearTimeout(t);
      t = setTimeout(() => setIsMobile(window.innerWidth < 640), 120);
    }
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // week start / days
  const weekStartDate = useMemo(() => {
    const diff = weekNumber - BASE_WEEK_NUMBER;
    return addDays(BASE_WEEK_START, diff * 7);
  }, [weekNumber]);
  const daysWithDates = useMemo(() => DAYS.map((d, i) => ({ label: d, date: addDays(weekStartDate, i) })), [weekStartDate]);

  // today index relative to week
  const todayIndex = useMemo(() => {
    const t = new Date();
    const midnight = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    const diff = Math.floor((midnight.getTime() - weekStartDate.getTime()) / (24 * 3600 * 1000));
    return diff >= 0 && diff < 7 ? diff : -1;
  }, [weekStartDate]);

  // load saved payload + colors on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { events: evs, noSchedule: ns } = normalizeToEvents(parsed, mappingMode);
        const savedColors = JSON.parse(localStorage.getItem(COLORS_STORAGE) || "{}");
        const evWithColors = evs.map((e) => ({ ...e, color: savedColors[e.code] ?? e.color }));
        setEvents(evWithColors);
        setNoSchedule(ns);
        setRawText(JSON.stringify(parsed, null, 2));
        setColors(savedColors);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      const { events: evs, noSchedule: ns } = normalizeToEvents(parsed, mappingMode);
      const savedColors = JSON.parse(localStorage.getItem(COLORS_STORAGE) || "{}");
      const evWithColors = evs.map((e) => ({ ...e, color: savedColors[e.code] ?? e.color }));
      setEvents(evWithColors);
      setNoSchedule(ns);
    } catch {}
  }, [mappingMode]);

  // events in week (filter by weekSeriesDisplay)
  const eventsInWeek = useMemo(() => {
    return events.filter((ev) => {
      const raw = ev.raw as any;
      const series = parseWeekSeries(raw?.weekSeriesDisplay);
      if (series.size > 0) return series.has(weekNumber);
      if (typeof raw?.weeksCalendarBegin === "number") return raw.weeksCalendarBegin === weekNumber;
      return ev.dayIndex >= 0;
    });
  }, [events, weekNumber]);

  // helpers exposed to components
  function layoutTopHeight(ev: NormalizedEvent) {
    const s = timeToMinutes(ev.startTime);
    const e = timeToMinutes(ev.endTime);
    const start = Math.max(DISPLAY_START_MIN, s);
    const end = Math.min(DISPLAY_END_MIN, Math.max(e, start + 30));
    const top = (start - DISPLAY_START_MIN) * PIXELS_PER_MINUTE;
    const height = Math.max(MIN_EVENT_HEIGHT, (end - start) * PIXELS_PER_MINUTE);
    return { top, height };
  }

  function saveColorForCode(code: string, c: string) {
    const next = { ...colors, [code]: c };
    setColors(next);
    localStorage.setItem(COLORS_STORAGE, JSON.stringify(next));
    setEvents((prev) => prev.map((ev) => (ev.code === code ? { ...ev, color: c } : ev)));
  }

  function handleImportText() {
    setError(null);
    try {
      const parsed = JSON.parse(rawText);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      const { events: evs, noSchedule: ns } = normalizeToEvents(parsed, mappingMode);
      const savedColors = JSON.parse(localStorage.getItem(COLORS_STORAGE) || "{}");
      const evWithColors = evs.map((e) => ({ ...e, color: savedColors[e.code] ?? e.color }));
      setEvents(evWithColors);
      setNoSchedule(ns);
    } catch (e: any) {
      setError(e?.message ?? "Invalid JSON");
    }
  }
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result ?? "");
      setRawText(text);
      try {
        const parsed = JSON.parse(text);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        const { events: evs, noSchedule: ns } = normalizeToEvents(parsed, mappingMode);
        const savedColors = JSON.parse(localStorage.getItem(COLORS_STORAGE) || "{}");
        const evWithColors = evs.map((e) => ({ ...e, color: savedColors[e.code] ?? e.color }));
        setEvents(evWithColors);
        setNoSchedule(ns);
      } catch (err: any) {
        setError(err?.message ?? "Invalid JSON file");
      }
    };
    reader.readAsText(f);
    if (fileRef.current) fileRef.current.value = "";
  }
  function handleExport() {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      setError("Không có lịch để xuất.");
      return;
    }
    const blob = new Blob([item], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "learning_schedule.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  function handleClear() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COLORS_STORAGE);
    setEvents([]);
    setNoSchedule([]);
    setRawText("");
    setError(null);
    setColors({});
  }

  function prevWeek() {
    setWeekNumber((w) => w - 1);
  }
  function nextWeek() {
    setWeekNumber((w) => w + 1);
  }

  const currentIndicatorTop = (nowMinutes - DISPLAY_START_MIN) * PIXELS_PER_MINUTE;
  const showCurrentIndicator = nowMinutes >= DISPLAY_START_MIN && nowMinutes <= DISPLAY_END_MIN;

  // palette helper (exposed if needed)
  function paletteForCode(code: string) {
    const base = hueFromString(code + "-palette");
    const out: string[] = [];
    for (let i = 0; i < 10; i++) {
      const h = (base + i * 28) % 360;
      out.push(`hsl(${h} 65% 85%)`);
    }
    out.push("#ffffff");
    out.push("#f8f9fa");
    return out;
  }

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">Quản lý thời khóa biểu</h1>
          <p className="text-sm text-muted-foreground">
            Chúng tôi cần sự <span className="font-medium text-foreground">feedback </span>
            và góp ý nhiều hơn để cải thiện tool.
            Tham gia nhóm:{" "}
            <a
              href="https://www.facebook.com/groups/khmt.ktmt.cse.bku"
              target="_blank"
              rel="noopener noreferrer"
              className="text-education-primary hover:underline"
            >
              Thảo luận kiến thức CNTT trường BK về KHMT(CScience), KTMT(CEngineering)
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {isMobile ? (
            <>
              <div className="lg:col-span-12">
                <CalendarPanel
                  weekNumber={weekNumber}
                  weekStartDate={weekStartDate}
                  daysWithDates={daysWithDates}
                  eventsInWeek={eventsInWeek}
                  todayIndex={todayIndex}
                  isMobile={isMobile}
                  mobileDefaultIndex={todayIndex >= 0 ? todayIndex : 0}
                  layoutTopHeight={layoutTopHeight}
                  setSelectedEvent={(ev) => { setSelectedEvent(ev); setSelectedColor(ev.color ?? colorFromString(ev.code + ev.title)); }}
                  currentIndicatorTop={currentIndicatorTop}
                  showCurrentIndicator={showCurrentIndicator}
                  fitToWidth={fitToWidth}
                  setFitToWidth={setFitToWidth}
                  prevWeek={prevWeek}
                  nextWeek={nextWeek}
                />
              </div>

              <div className="lg:col-span-12">
                <ImportPanel
                  rawText={rawText}
                  setRawText={setRawText}
                  onImport={handleImportText}
                  onFile={handleFile}
                  onExport={handleExport}
                  onClear={handleClear}
                  isMobile={isMobile}
                  fileRef={fileRef}
                />
              </div>

              <div className="lg:col-span-12 mt-2">
                <ColorPalette colors={colors} onChange={saveColorForCode} />
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-4">
                <ImportPanel
                  rawText={rawText}
                  setRawText={setRawText}
                  onImport={handleImportText}
                  onFile={handleFile}
                  onExport={handleExport}
                  onClear={handleClear}
                  isMobile={isMobile}
                  fileRef={fileRef}
                />
                <div className="mt-4">
                  <ColorPalette colors={colors} onChange={saveColorForCode} />
                </div>
              </div>

              <div className="lg:col-span-8">
                <CalendarPanel
                  weekNumber={weekNumber}
                  weekStartDate={weekStartDate}
                  daysWithDates={daysWithDates}
                  eventsInWeek={eventsInWeek}
                  todayIndex={todayIndex}
                  isMobile={isMobile}
                  mobileDefaultIndex={todayIndex >= 0 ? todayIndex : 0}
                  layoutTopHeight={layoutTopHeight}
                  setSelectedEvent={(ev) => { setSelectedEvent(ev); setSelectedColor(ev.color ?? colorFromString(ev.code + ev.title)); }}
                  currentIndicatorTop={currentIndicatorTop}
                  showCurrentIndicator={showCurrentIndicator}
                  fitToWidth={fitToWidth}
                  setFitToWidth={setFitToWidth}
                  prevWeek={prevWeek}
                  nextWeek={nextWeek}
                />
              </div>
            </>
          )}
        </div>

        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            color={selectedColor}
            setColor={(c) => {
              setSelectedColor(c);
              setEvents((prev) => prev.map((ev) => (ev.code === selectedEvent.code ? { ...ev, color: c } : ev)));
            }}
            paletteForCode={paletteForCode}
            onSave={() => {
              if (selectedEvent) saveColorForCode(selectedEvent.code, selectedColor);
              setSelectedEvent(null);
              setDraggingColor(false);
            }}
            onClose={() => {
              setSelectedEvent(null);
              setDraggingColor(false);
            }}
            draggingColor={draggingColor}
            setDraggingColor={setDraggingColor}
          />
        )}
      </div>
    </Layout>
  );
}
