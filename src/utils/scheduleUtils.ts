const WEEK1_START_STATIC = new Date(2025, 7, 25); // 25/08/2025

export const pad2 = (n: number) => String(n).padStart(2, '0');

export const ddmmyyyy = (date: Date) => {
  const d = pad2(date.getDate());
  const m = pad2(date.getMonth() + 1);
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

export const yyyymmdd = (date: Date) => 
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const collapseWhitespace = (s?: string) => {
  if (!s) return '';
  return String(s).replace(/\s+/g, ' ').trim();
};

export const cleanText = (t?: string) => collapseWhitespace(t || '');

export const parseWeekdayToIndex = (s?: string) => {
  if (!s) return null;
  const t = collapseWhitespace(String(s).toLowerCase());
  if (t.includes('chưa') || t.includes('chua')) return null;
  if (t.includes('cn') || t.includes('chủ') || t.includes('chu')) return 0;
  const m = t.match(/([2-7])/);
  if (m) return Number(m[1]) - 1;
  return null;
};

export const isTuanCharActive = (ch?: string) => {
  if (!ch) return false;
  return !(ch === '-' || ch === '0' || ch === ' ');
};

export const makeScheduleKey = (course: any, group: any, schedule: any) =>
  `${course.id}||${group.lt_group}||${schedule.thu || ''}||${schedule.tiet || ''}||${schedule.tuan_hoc || ''}`;

export const parseTietToRange = (tietStr?: string) => {
  if (!tietStr) return null;
  const nums = (tietStr.match(/\d+/g) || []).map(x => Number(x));
  if (nums.length === 0) return null;
  const minP = Math.min(...nums);
  const maxP = Math.max(...nums);
  const start = 6 * 60 + (minP - 1) * 60;
  const end = 6 * 60 + maxP * 60;
  const h1 = Math.floor(start / 60);
  const m1 = pad2(start % 60);
  const h2 = Math.floor(end / 60);
  const m2 = pad2(end % 60);
  return `${pad2(h1)}:${m1} - ${pad2(h2)}:${m2}`;
};

export const WEEKDAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export const getDaysArrayOfMonth = (month: number, year: number) => {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const arr: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) arr.push(null);
  for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
  return arr;
};

export const buildScheduleOccurrencesCache = (courses: any[]) => {
  const cache = new Map();
  for (const course of courses) {
    for (const g of course.list_group || []) {
      for (const s of g.schedules || []) {
        const key = makeScheduleKey(course, g, s);
        const thuIdx = parseWeekdayToIndex(s.thu);
        const occurrences: string[] = [];
        if (thuIdx === null || !s.tuan_hoc) {
          cache.set(key, occurrences);
          continue;
        }
        const weeksStr = s.tuan_hoc;
        const offsetFromMonday = (thuIdx + 6) % 7;
        for (let i = 0; i < weeksStr.length; i++) {
          const ch = weeksStr[i];
          if (!isTuanCharActive(ch)) continue;
          const date = addDays(WEEK1_START_STATIC, i * 7 + offsetFromMonday);
          occurrences.push(yyyymmdd(date));
        }
        cache.set(key, occurrences);
      }
    }
  }
  return cache;
};

export const isScheduleOnDate = (
  course: any, 
  group: any, 
  schedule: any, 
  date: Date, 
  cache: Map<string, string[]>
) => {
  const key = makeScheduleKey(course, group, schedule);
  const arr = cache.get(key) || [];
  const target = yyyymmdd(date);
  return arr.includes(target);
};

export const parseDateFromInput = (str: string) => {
  const m = String(str || '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const y = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (isNaN(dt.getTime())) return null;
  return dt;
};
