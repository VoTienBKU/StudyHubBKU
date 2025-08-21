import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as IconCalendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import coursesData from "@/data/course_sched.json"; // <-- đảm bảo file JSON ở src/data/course_sched.json

// ---------- HELPERS ----------
const WEEK1_START_STATIC = new Date(2025, 7, 25); // 25/08/2025 là ngày bắt đầu Tuần 1 (Thứ 2)
function pad2(n) { return String(n).padStart(2, '0'); }
function ddmmyyyy(date) { const d = pad2(date.getDate()); const m = pad2(date.getMonth() + 1); const y = date.getFullYear(); return `${d}/${m}/${y}`; }
function yyyymmdd(date) { return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`; }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

function collapseWhitespace(s) { if (!s) return ''; return String(s).replace(/\s+/g, ' ').trim(); }
function cleanText(t) { return collapseWhitespace(t || ''); }

function parseWeekdayToIndex(s) {
  if (!s) return null;
  const t = collapseWhitespace(String(s).toLowerCase());
  if (t.includes('chưa') || t.includes('chua')) return null;
  if (t.includes('cn') || t.includes('chủ') || t.includes('chu')) return 0; // Chủ nhật -> 0
  const m = t.match(/([2-7])/);
  if (m) return Number(m[1]) - 1;
  return null;
}

function isTuanCharActive(ch) { if (!ch) return false; return !(ch === '-' || ch === '0' || ch === ' '); }
function makeScheduleKey(course, group, schedule) { return `${course.id}||${group.group_name}||${schedule.thu || ''}||${schedule.tiet || ''}||${schedule.tuan_hoc || ''}`; }

// Convert tiết string to a time range
// Rule: tiết 1 starts at 06:00, each tiết = 60 minutes
function parseTietToRange(tietStr) {
  if (!tietStr) return null;
  const nums = (tietStr.match(/\d+/g) || []).map(x => Number(x));
  if (nums.length === 0) return null;
  const minP = Math.min(...nums);
  const maxP = Math.max(...nums);
  const start = 6 * 60 + (minP - 1) * 60;
  const end = 6 * 60 + maxP * 60;
  const h1 = Math.floor(start / 60), m1 = pad2(start % 60);
  const h2 = Math.floor(end / 60), m2 = pad2(end % 60);
  return `${pad2(h1)}:${m1} - ${pad2(h2)}:${m2}`;
}

const WEEKDAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

// ---------- Small calendar helper ----------
function getDaysArrayOfMonth(month, year) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0..6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const arr = [];
  for (let i = 0; i < startDay; i++) arr.push(null);
  for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
  return arr;
}

// ---------- COMPONENT ----------
const Schedule = () => {
  const COURSES = useMemo(() => coursesData || [], []);

  // precompute occurrences (kept for date filtering)
  const scheduleOccurrencesCache = useMemo(() => {
    const cache = new Map();
    for (const course of COURSES) {
      for (const g of course.list_group || []) {
        for (const s of g.schedules || []) {
          const key = makeScheduleKey(course, g, s);
          const thuIdx = parseWeekdayToIndex(s.thu);
          const occurrences = [];
          if (thuIdx === null || !s.tuan_hoc) { cache.set(key, occurrences); continue; }
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
  }, [COURSES]);

  function isScheduleOnDate(course, group, schedule, date) { const key = makeScheduleKey(course, group, schedule); const arr = scheduleOccurrencesCache.get(key) || []; const target = yyyymmdd(date); return arr.indexOf(target) !== -1; }

  // UI state
  const [today] = useState(() => new Date());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const [activeCampus, setActiveCampus] = useState("all");
  const [searchQ, setSearchQ] = useState("CO2003");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateInput, setDateInput] = useState("");

  // Options
  const [filterByDate, setFilterByDate] = useState(false);
  const [showAllDatesForCourse, setShowAllDatesForCourse] = useState(false);

  useEffect(() => {
    const q = (searchQ || "").trim().toLowerCase();
    if (!q) { setSearchResults([]); return; }
    const matches = COURSES.filter(function (c) { return (c.course_code || '').toLowerCase().indexOf(q) !== -1 || (c.course_name || '').toLowerCase().indexOf(q) !== -1; });
    setSearchResults(matches);
  }, [searchQ, COURSES]);

  // Gather lecturers for selected course
  const lecturersForSelectedCourse = useMemo(() => {
    if (!selectedCourse) return [];
    const set = new Set();
    for (const g of selectedCourse.list_group || []) {
      const a = cleanText(g.lecturer || '');
      const b = cleanText(g.bt_lecturer || '');
      if (a && !/chưa|đang phân công/i.test(a)) set.add(a);
      if (b && !/chưa|đang phân công/i.test(b)) set.add(b);
    }
    return Array.from(set).sort();
  }, [selectedCourse]);

  // helper to test lecturer match (applies only when selectedCourse exists)
  function lecturerMatches(group) {
    if (!selectedLecturer || selectedLecturer === 'all') return true;
    const a = cleanText(group.lecturer || '');
    const b = cleanText(group.bt_lecturer || '');
    return (a && a === selectedLecturer) || (b && b === selectedLecturer);
  }

  // Combined items (flat list) - obeys: campus, selectedCourse, selectedLecturer, selectedDate (optional)
  const combinedItems = useMemo(() => {
    const items = [];
    function pushIfMatch(course, group, schedule) {
      if (activeCampus !== 'all' && String(schedule.cs) !== String(activeCampus)) return;
      items.push({ course, group, schedule });
    }

    // if a course is selected -> iterate its groups
    if (selectedCourse) {
      for (const g of selectedCourse.list_group || []) {
        if (!lecturerMatches(g)) continue; // apply lecturer filter when a course is selected
        for (const s of g.schedules || []) {
          if (showAllDatesForCourse) { pushIfMatch(selectedCourse, g, s); }
          else if (filterByDate && selectedDate) { if (isScheduleOnDate(selectedCourse, g, s, selectedDate)) pushIfMatch(selectedCourse, g, s); }
          else { pushIfMatch(selectedCourse, g, s); }
        }
      }
      return items;
    }

    // no selectedCourse: searchResults (multiple courses)
    if (searchResults.length > 0) {
      for (const course of searchResults) {
        for (const g of course.list_group || []) {
          for (const s of g.schedules || []) {
            if (filterByDate && selectedDate) { if (isScheduleOnDate(course, g, s, selectedDate)) pushIfMatch(course, g, s); }
            else pushIfMatch(course, g, s);
          }
        }
      }
      return items;
    }

    return items;
  }, [selectedCourse, selectedLecturer, selectedDate, filterByDate, showAllDatesForCourse, searchResults, activeCampus, COURSES, scheduleOccurrencesCache]);

  // Grouping helpers
  const groupedForSelectedCourse = useMemo(() => {
    if (!selectedCourse) return null;
    const map = { 'Thứ 2': [], 'Thứ 3': [], 'Thứ 4': [], 'Thứ 5': [], 'Thứ 6': [], 'Thứ 7': [], 'Chủ nhật': [], 'Không rõ': [] };
    for (const g of selectedCourse.list_group || []) {
      if (!lecturerMatches(g)) continue;
      for (const s of g.schedules || []) {
        if (activeCampus !== 'all' && String(s.cs) !== String(activeCampus)) continue;
        if (filterByDate && selectedDate && !isScheduleOnDate(selectedCourse, g, s, selectedDate)) continue;
        const idx = parseWeekdayToIndex(s.thu);
        const label = (idx === null) ? 'Không rõ' : WEEKDAY_LABELS[idx];
        map[label] = map[label] || [];
        map[label].push({ course: selectedCourse, group: g, schedule: s });
      }
    }
    return map;
  }, [selectedCourse, selectedLecturer, activeCampus, selectedDate, filterByDate]);

  const groupedByWeekday = useMemo(() => {
    const map = { 'Thứ 2': [], 'Thứ 3': [], 'Thứ 4': [], 'Thứ 5': [], 'Thứ 6': [], 'Thứ 7': [], 'Chủ nhật': [], 'Không rõ': [] };
    for (const it of combinedItems) {
      const idx = parseWeekdayToIndex(it.schedule.thu);
      const label = (idx === null) ? 'Không rõ' : WEEKDAY_LABELS[idx];
      map[label] = map[label] || [];
      map[label].push(it);
    }
    return map;
  }, [combinedItems]);

  // handlers
  function handleSelectCourse(course) { setSelectedCourse(course); setSelectedLecturer('all'); }
  function clearSelection() { setSelectedCourse(null); setSelectedLecturer('all'); setSelectedDate(null); setSearchQ(''); setSearchResults([]); setDateInput(''); setFilterByDate(false); setShowAllDatesForCourse(false); }
  function parseDateFromInput(str) { const m = String(str || '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (!m) return null; const d = Number(m[1]), mo = Number(m[2]) - 1, y = Number(m[3]); const dt = new Date(y, mo, d); if (isNaN(dt.getTime())) return null; return dt; }
  function applyDateInput() { const dt = parseDateFromInput(dateInput); if (dt) { setSelectedDate(dt); setFilterByDate(true); setViewMonth(dt.getMonth()); setViewYear(dt.getFullYear()); setDateInput(ddmmyyyy(dt)); } else alert('Nhập dd/mm/yyyy hợp lệ'); }

  // mini-calendar nav
  function goPrevMonth() { let m = viewMonth - 1, y = viewYear; if (m < 0) { m = 11; y -= 1; } setViewMonth(m); setViewYear(y); }
  function goNextMonth() { let m = viewMonth + 1, y = viewYear; if (m > 11) { m = 0; y += 1; } setViewMonth(m); setViewYear(y); }
  function goToday() { const t = new Date(); setViewMonth(t.getMonth()); setViewYear(t.getFullYear()); setSelectedDate(t); setFilterByDate(true); setDateInput(ddmmyyyy(t)); }

  const daysInView = useMemo(() => getDaysArrayOfMonth(viewMonth, viewYear), [viewMonth, viewYear]);

  // helper: check if any schedule exists on given date (respecting activeCampus and optional selectedCourse/lecturer)
  function hasEventsOnDate(date) {
    for (const course of COURSES) {
      for (const g of course.list_group || []) {
        if (selectedCourse && course.id !== selectedCourse.id) continue; // if course selected, only check that course
        if (selectedCourse && !lecturerMatches(g)) continue; // respect lecturer filter
        for (const s of g.schedules || []) {
          if (activeCampus !== 'all' && String(s.cs) !== String(activeCampus)) continue;
          if (isScheduleOnDate(course, g, s, date)) return true;
        }
      }
    }
    return false;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-1">Thời khóa biểu HCMUT</h1>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* SIDEBAR */}
            <div className="col-span-4">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconCalendar className="h-5 w-5 text-primary" />
                    Tìm & Lọc
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Tìm theo mã/tên môn (vd: AS2013)"
                        className="w-full rounded-md border px-3 py-2"
                        value={searchQ}
                        onChange={(e) => setSearchQ(e.target.value)}
                      />

                      {searchQ && searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 max-h-48 overflow-auto bg-white border rounded-md shadow-lg">
                          {searchResults.map(c => (
                            <div
                              key={c.id}
                              className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-100 cursor-pointer"
                              onClick={() => {
                                setSearchQ(`${c.course_code} — ${c.course_name}`);
                                handleSelectCourse(c);
                              }}
                            >
                              <div className="flex-1">
                                <div className="text-sm font-medium">{c.course_code} - {c.course_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Nhóm: {c.list_group?.length || 0}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>


                    <div className="flex gap-2">
                      <button className={`px-3 py-1 rounded-full ${activeCampus === 'all' ? 'bg-primary text-white' : 'bg-slate-100'}`} onClick={() => setActiveCampus('all')}>Tất cả cơ sở</button>
                      <button className={`px-3 py-1 rounded-full ${activeCampus === '1' ? 'bg-primary text-white' : 'bg-slate-100'}`} onClick={() => setActiveCampus('1')}>CS1</button>
                      <button className={`px-3 py-1 rounded-full ${activeCampus === '2' ? 'bg-primary text-white' : 'bg-slate-100'}`} onClick={() => setActiveCampus('2')}>CS2</button>
                    </div>

                    {selectedCourse && lecturersForSelectedCourse.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm font-semibold mb-1">Giảng viên</div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className={`px-3 py-1 rounded-full ${selectedLecturer === 'all' ? 'bg-primary text-white' : 'bg-slate-100'}`}
                            onClick={() => setSelectedLecturer('all')}
                          >
                            Tất cả
                          </button>
                          {lecturersForSelectedCourse.map((lecturer, idx) => (
                            <button
                              key={idx}
                              className={`px-3 py-1 rounded-full ${selectedLecturer === lecturer ? 'bg-primary text-white' : 'bg-slate-100'}`}
                              onClick={() => setSelectedLecturer(lecturer)}
                            >
                              {lecturer}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="flex-1 rounded-md border px-3 py-2" onClick={clearSelection}>Clear</button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* MINI CALENDAR */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><IconCalendar className="h-4 w-4" /> Chọn ngày</div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded border" onClick={goPrevMonth}><ChevronLeft className="h-4 w-4" /></button>
                      <div className="text-xs px-2">{viewMonth + 1}/{viewYear}</div>
                      <button className="p-1 rounded border" onClick={goNextMonth}><ChevronRight className="h-4 w-4" /></button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs mb-2 grid grid-cols-7 gap-1 text-center font-medium">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(w => <div key={w} className="py-1">{w}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {daysInView.map((d, idx) => {
                      if (!d) return <div key={`b-${idx}`} className="h-8 rounded text-xs" />;
                      const isToday = (new Date()).toDateString() === d.toDateString();
                      const isSelected = selectedDate ? selectedDate.toDateString() === d.toDateString() : false;
                      const hasEvent = hasEventsOnDate(d);
                      return (
                        <button key={d.toISOString()} onClick={() => { setSelectedDate(d); setFilterByDate(true); setDateInput(ddmmyyyy(d)); setViewMonth(d.getMonth()); setViewYear(d.getFullYear()); }} className={`h-8 rounded text-xs flex flex-col items-center justify-center ${isSelected ? 'ring-2 ring-blue-400/40 bg-blue-600/5' : ''} ${isToday && !isSelected ? 'bg-yellow-400/5' : ''}`}>
                          <div className={`text-sm ${isSelected ? 'font-semibold' : ''}`}>{d.getDate()}</div>
                          <div className={`h-1 w-1 rounded-full ${hasEvent ? 'bg-primary' : 'bg-transparent'}`} />
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button className="flex-1 rounded-md border px-2 py-1 text-sm" onClick={() => { setSelectedDate(null); setFilterByDate(false); setDateInput(''); }}>Bỏ chọn</button>
                    <button className="rounded-md border px-2 py-1 text-sm" onClick={goToday}>Hôm nay</button>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* MAIN: results only */}
            <div className="col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Kết quả</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <span className="text-sm text-muted-foreground">Số kết quả: </span>
                    <span className="font-semibold">{combinedItems.length}</span>
                    <span className="text-sm text-muted-foreground ml-2"> (lọc: {filterByDate ? 'có' : 'không'} theo ngày; {activeCampus === 'all' ? 'Tất cả cơ sở' : `CS${activeCampus}`})</span>
                  </div>

                  {combinedItems.length === 0 ? (
                    <div className="text-muted-foreground">Không có kết quả theo lựa chọn hiện tại.</div>
                  ) : (
                    <div className="space-y-3">
                      {/* Rendering priority:
                          1) If a course is selected AND no date chosen => group by weekday for that course (applies lecturer filter)
                          2) Else if NOT filtering by date -> group combinedItems by weekday
                          3) Else (filterByDate) -> flat list
                      */}
                      {selectedCourse && !filterByDate ? (
                        <div className="space-y-4">
                          {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật', 'Không rõ'].map((label) => {
                            const list = (groupedForSelectedCourse && groupedForSelectedCourse[label]) || [];
                            if (list.length === 0) return null;
                            return (
                              <div key={label}>
                                <div className="text-sm font-semibold mb-2">{label} ({list.length})</div>
                                <div className="space-y-2">
                                  {list.map((it, i) => (
                                    <div key={i} className="p-3 rounded-md border bg-slate-800/20">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="text-sm font-semibold">{it.course.course_code} — {it.course.course_name}</div>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-100">
                                              Phòng: {cleanText(it.schedule.phong) || '-'}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-100">
                                              Thời gian: {parseTietToRange(it.schedule.tiet) || '-'}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-500 text-slate-100">
                                              Giảng viên: {cleanText(it.group.lecturer) || "Chưa phân công"}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                          CS: {it.schedule.cs || '-'}<br />
                                          Nhóm: {it.group.group_name}
                                        </div>
                                      </div>
                                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                        <div>Tiết: {cleanText(it.schedule.tiet) || '-'} • Tuần: {cleanText(it.schedule.tuan_hoc) || '-'}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      ) : (!filterByDate ? (
                        <div className="space-y-4">
                          {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật', 'Không rõ'].map((label) => {
                            const list = groupedByWeekday[label] || [];
                            if (list.length === 0) return null;
                            return (
                              <div key={label}>
                                <div className="text-sm font-semibold mb-2">{label} ({list.length})</div>
                                <div className="space-y-2">
                                  {list.map((it, i) => (
                                    <div key={i} className="p-3 rounded-md border bg-slate-800/20">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="text-sm font-semibold">{it.course.course_code} — {it.course.course_name}</div>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-100">
                                              Phòng: {cleanText(it.schedule.phong) || '-'}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-100">
                                              Thời gian: {parseTietToRange(it.schedule.tiet) || '-'}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-500 text-slate-100">
                                              Giảng viên: {cleanText(it.group.lecturer) || "Chưa phân công"}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                          CS: {it.schedule.cs || '-'}<br />
                                          Nhóm: {it.group.group_name}
                                        </div>
                                      </div>
                                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                        <div>Tiết: {cleanText(it.schedule.tiet) || '-'} • Tuần: {cleanText(it.schedule.tuan_hoc) || '-'}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // filterByDate === true -> flat list
                        combinedItems.map((it, i) => (
                          <div key={i} className="p-3 rounded-md border bg-slate-800/20">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-sm font-semibold">{it.course.course_code} — {it.course.course_name}</div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-100">
                                    Phòng: {cleanText(it.schedule.phong) || '-'}
                                  </span>
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-100">
                                    Thời gian: {parseTietToRange(it.schedule.tiet) || '-'}
                                  </span>
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-500 text-slate-100">
                                    Giảng viên: {cleanText(it.group.lecturer) || "Chưa phân công"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right text-xs text-muted-foreground">
                                CS: {it.schedule.cs || '-'}<br />
                                Nhóm: {it.group.group_name}
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground space-y-1">
                              <div>Tiết: {cleanText(it.schedule.tiet) || '-'} • Tuần: {cleanText(it.schedule.tuan_hoc) || '-'}</div>
                            </div>
                          </div>
                        ))
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;
