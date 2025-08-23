type RawCampus = { id?: number; code?: string; nameVi?: string; nameEn?: string };
type RawBuilding = { id?: number; code?: string; campus?: RawCampus };
type RawRoom = { id?: number; code?: string; building?: RawBuilding };
type RawEmployee = { id?: number; code?: string; firstName?: string; lastName?: string; email?: string | null };
type RawSubject = { id?: number; code?: string; nameVi?: string; nameEn?: string; numOfCredits?: number };
type RawItem = {
  id?: number;
  mssv?: string;
  subject?: RawSubject;
  employee?: RawEmployee;
  room?: RawRoom;
  dayOfWeek?: number | string | null;
  startTime?: string;
  endTime?: string;
  numOfLesson?: number;
  weekSeriesDisplay?: string;
  [k: string]: any;
};

function mapDayToIndex(d: number | null | undefined, mode: MappingMode) {
  if (d === null || d === undefined || Number.isNaN(Number(d))) return -1;
  const n = Number(d);
  if (mode === "server_2_is_monday") {
    if (n === 0) return -1;
    return (n + 5) % 7;
  }
  return -1;
}

export type MappingMode = "server_2_is_monday";
export type NormalizedEvent = {
  id: number | string;
  code: string;
  title: string;
  teacher: string;
  room: string;
  dayIndex: number; // 0 = Mon .. 6 = Sun
  startTime?: string;
  endTime?: string;
  raw: RawItem;
  color?: string;
};

export function timeToMinutes(t?: string) {
  if (!t) return 0;
  const p = String(t).split(":").map((s) => parseInt(s, 10));
  if (p.length === 1) return (isNaN(p[0]) ? 0 : p[0] * 60);
  return (isNaN(p[0]) ? 0 : p[0] * 60) + (isNaN(p[1]) ? 0 : p[1]);
}

export function colorFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return `hsl(${h} 65% 85%)`;
}

export function normalizeToEvents(parsed: any, mappingMode: MappingMode) {
  const arr: any[] = Array.isArray(parsed) ? parsed : parsed?.data ?? [];
  if (!Array.isArray(arr)) return { events: [] as NormalizedEvent[], noSchedule: [] as NormalizedEvent[] };

  const list: NormalizedEvent[] = arr.map((it: RawItem) => {
    const rawDay = typeof it.dayOfWeek === "number" ? it.dayOfWeek : (typeof it.dayOfWeek === "string" && it.dayOfWeek.trim() !== "" ? Number(it.dayOfWeek) : null);
    const dayIndex = mapDayToIndex(rawDay, mappingMode);
    const title = it.subject?.nameVi ?? it.subject?.nameEn ?? it.subject?.code ?? "Untitled";
    const code = it.subject?.code ?? String(it.id ?? "");
    const teacher = [it.employee?.firstName, it.employee?.lastName].filter(Boolean).join(" ") || it.employee?.code || "";
    const room = it.room?.code ?? "";

    return {
      id: it.id ?? Math.random().toString(36).slice(2, 9),
      code,
      title,
      teacher,
      room,
      dayIndex,
      startTime: it.startTime,
      endTime: it.endTime,
      raw: it,
      color: colorFromString(code + title)
    } as NormalizedEvent;
  });

  // noSchedule rules: dayIndex < 0 OR numOfLesson === 0 OR startTime===0:00 && endTime===0:00
  const noSchedule = list.filter((e) => {
    const r = e.raw as RawItem;
    if (e.dayIndex < 0) return true;
    if (typeof r.numOfLesson === "number" && r.numOfLesson <= 0) return true;
    if (String(r.startTime).trim() === "0:00" && String(r.endTime).trim() === "0:00") return true;
    return false;
  });

  const events = list.filter((e) => !noSchedule.includes(e));
  events.sort((a, b) => (a.dayIndex !== b.dayIndex ? a.dayIndex - b.dayIndex : timeToMinutes(a.startTime) - timeToMinutes(b.startTime)));
  return { events, noSchedule };
}
export function addDays(d: Date, days: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

export function formatDate(d: Date) {
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function parseWeekSeries(series?: string) {
  if (!series) return new Set<number>();
  return new Set(series.split("|").map((s) => {
    const t = s.trim();
    const n = Number(t);
    return Number.isNaN(n) ? null : n;
  }).filter(Boolean) as number[]);
}

export function hueFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}