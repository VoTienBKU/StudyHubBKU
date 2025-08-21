import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as IconCalendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import coursesData from "@/data/course_sched.json"; // <-- đảm bảo file JSON ở src/data/course_sched.json

// ---------- CẤU HÌNH / HÀM HỖ TRỢ CHUNG ----------
const WEEK1_START_STATIC = new Date(2025, 7, 25); // 25/08/2025 là ngày bắt đầu Tuần 1 (Thứ 2)
function pad2(n){ return String(n).padStart(2,'0'); }
function ddmmyyyy(date){ const d = pad2(date.getDate()); const m = pad2(date.getMonth()+1); const y = date.getFullYear(); return `${d}/${m}/${y}`; }
function yyyymmdd(date){ return `${date.getFullYear()}-${pad2(date.getMonth()+1)}-${pad2(date.getDate())}`; }
function addDays(d, n){ const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function cleanText(t){ return (t||"").replace(/\t|\n|\r/g,' ').replace(/\s+/g,' ').trim(); }

function parseWeekdayToIndex(s) {
  if (!s) return null;
  const t = String(s).toLowerCase().normalize("NFC").replace(/\s+/g, " ").trim();
  if (t.includes("chưa") || t.includes("chua")) return null;
  if (t.includes("cn") || t.includes("chủ") || t.includes("chu")) return 0; // Chủ nhật -> 0
  const m = t.match(/([2-7])/);
  if (m) return Number(m[1]) - 1;
  const spelled = t.match(/thu\s*([0-9])/);
  if (spelled) return Number(spelled[1]) - 1;
  return null;
}

function isTuanCharActive(ch){ if (!ch) return false; if (ch === '-' || ch === '0' || ch === ' ') return false; return true; }
function makeScheduleKey(course, group, schedule){ return `${course.id}||${group.group_name}||${schedule.thu}||${schedule.tiet}||${schedule.tuan_hoc}`; }

// ---------- COMPONENT ----------
const Schedule = () => {
  const COURSES = useMemo(() => coursesData || [], []);

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
            const date = addDays(WEEK1_START_STATIC, i*7 + offsetFromMonday);
            occurrences.push(yyyymmdd(date));
          }
          cache.set(key, occurrences);
        }
      }
    }
    return cache;
  }, [COURSES]);

  function isScheduleOnDate(course, group, schedule, date){ const key = makeScheduleKey(course, group, schedule); const arr = scheduleOccurrencesCache.get(key) || []; const target = yyyymmdd(date); return arr.includes(target); }

  // UI state
  const [today, setToday] = useState(() => new Date());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [activeCampus, setActiveCampus] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateInput, setDateInput] = useState("");

  useEffect(() => { setToday(new Date()); }, []);

  const renderWeekdayNames = ["CN","T2","T3","T4","T5","T6","T7"];
  function getDaysArrayOfMonth(month, year){ const first = new Date(year, month, 1); const startDay = first.getDay(); const daysInMonth = new Date(year, month+1, 0).getDate(); const arr = []; for (let i=0;i<startDay;i++) arr.push(null); for (let d=1; d<=daysInMonth; d++) arr.push(new Date(year, month, d)); return arr; }

  useEffect(() => {
    const q = (searchQ || "").trim().toLowerCase();
    if (!q) { setSearchResults([]); return; }
    const matches = COURSES.filter(c => (c.course_code||"").toLowerCase().includes(q) || (c.course_name||"").toLowerCase().includes(q));
    setSearchResults(matches);
  }, [searchQ, COURSES]);

  const combinedItems = useMemo(() => {
    const items = [];
    if (selectedCourse && selectedDate) {
      for (const g of selectedCourse.list_group || []) {
        for (const s of g.schedules || []) {
          if (activeCampus !== "all" && String(s.cs) !== String(activeCampus)) continue;
          if (isScheduleOnDate(selectedCourse, g, s, selectedDate)) items.push({ course: selectedCourse, group: g, schedule: s });
        }
      }
      return items;
    }
    if (selectedCourse && !selectedDate) {
      for (const g of selectedCourse.list_group || []) {
        for (const s of g.schedules || []) {
          if (activeCampus !== "all" && String(s.cs) !== String(activeCampus)) continue;
          items.push({ course: selectedCourse, group: g, schedule: s });
        }
      }
      return items;
    }
    if (!selectedCourse && selectedDate) {
      for (const course of COURSES) {
        for (const g of course.list_group || []) {
          for (const s of g.schedules || []) {
            if (activeCampus !== "all" && String(s.cs) !== String(activeCampus)) continue;
            if (isScheduleOnDate(course, g, s, selectedDate)) items.push({ course, group: g, schedule: s });
          }
        }
      }
      return items;
    }
    const d = today;
    for (const course of COURSES) {
      for (const g of course.list_group || []) {
        for (const s of g.schedules || []) {
          if (activeCampus !== "all" && String(s.cs) !== String(activeCampus)) continue;
          if (isScheduleOnDate(course, g, s, d)) items.push({ course, group: g, schedule: s });
        }
      }
    }
    return items;
  }, [selectedCourse, selectedDate, activeCampus, COURSES, scheduleOccurrencesCache, today]);

  function badgesForDate(date){
    const list = [];
    for (const course of COURSES) {
      for (const g of course.list_group || []) {
        for (const s of g.schedules || []) {
          if (activeCampus !== "all" && String(s.cs) !== String(activeCampus)) continue;
          if (isScheduleOnDate(course, g, s, date)) { list.push({ course, group: g, schedule: s }); if (list.length >= 6) break; }
        }
        if (list.length >= 6) break;
      }
      if (list.length >= 6) break;
    }
    return list;
  }

  function handleSelectDate(date){ setSelectedDate(date); setDateInput(ddmmyyyy(date)); }
  function handleSelectCourse(course){ setSelectedCourse(course); }
  function clearSelection(){ setSelectedCourse(null); setSelectedDate(null); setSearchQ(""); setSearchResults([]); setDateInput(""); }
  function parseDateFromInput(str){ const m = String(str).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (!m) return null; const d = Number(m[1]), mo = Number(m[2]) - 1, y = Number(m[3]); const dt = new Date(y, mo, d); if (isNaN(dt.getTime())) return null; return dt; }
  function goPrevMonth(){ let m = viewMonth - 1, y = viewYear; if (m < 0) { m = 11; y -= 1; } setViewMonth(m); setViewYear(y); }
  function goNextMonth(){ let m = viewMonth + 1, y = viewYear; if (m > 11) { m = 0; y += 1; } setViewMonth(m); setViewYear(y); }
  function goToday(){ const t = new Date(); setToday(t); setViewMonth(t.getMonth()); setViewYear(t.getFullYear()); setSelectedDate(t); setDateInput(ddmmyyyy(t)); }

  const daysInView = useMemo(() => getDaysArrayOfMonth(viewMonth, viewYear), [viewMonth, viewYear]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-1">Thời khóa biểu</h1>
            <p className="text-muted-foreground">Lịch học BKU</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
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
                    <input type="text" placeholder="Tìm theo mã/tên môn (vd: AS2013)" className="w-full rounded-md border px-3 py-2" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
                    <div className="flex gap-2">
                      <input type="text" placeholder="dd/mm/yyyy" className="flex-1 rounded-md border px-3 py-2" value={dateInput} onChange={(e)=> setDateInput(e.target.value)} onKeyDown={(e)=> { if(e.key === "Enter") { const dt = parseDateFromInput(dateInput); if (dt) handleSelectDate(dt); else alert("Nhập dd/mm/yyyy hợp lệ"); } }} />
                      <button className="rounded-md px-3 py-2 bg-primary text-white" onClick={()=>{ const dt = parseDateFromInput(dateInput); if (dt) handleSelectDate(dt); else alert("Nhập dd/mm/yyyy hợp lệ"); }}>Chọn ngày</button>
                    </div>

                    <div className="flex gap-2">
                      <button className={`px-3 py-1 rounded-full ${activeCampus === 'all' ? 'bg-primary text-white' : 'bg-slate-100'}`} onClick={()=> setActiveCampus('all')}>Tất cả cơ sở</button>
                      <button className={`px-3 py-1 rounded-full ${activeCampus === '1' ? 'bg-primary text-white' : 'bg-slate-100'}`} onClick={()=> setActiveCampus('1')}>CS1</button>
                      <button className={`px-3 py-1 rounded-full ${activeCampus === '2' ? 'bg-primary text-white' : 'bg-slate-100'}`} onClick={()=> setActiveCampus('2')}>CS2</button>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Kết quả tìm</div>
                      <div className="max-h-64 overflow-auto space-y-2">
                        {searchResults.length === 0 ? (
                          <div className="text-sm text-muted-foreground">Nhập mã/tên rồi nhấn Enter hoặc click để chọn</div>
                        ) : (
                          searchResults.map(c => (
                            <div key={c.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer" onClick={()=> handleSelectCourse(c)}>
                              <div className="text-sm font-semibold w-20">{c.course_code}</div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{c.course_name}</div>
                                <div className="text-xs text-muted-foreground">Nhóm: {c.list_group?.length || 0}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 rounded-md border px-3 py-2" onClick={clearSelection}>Clear</button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Chọn một ngày trên lịch (ô nhỏ, chỉ số ngày) hoặc tìm mã môn để xem chi tiết.</p>
                  <div className="mt-3 text-sm">
                    <div><strong>Môn đã chọn:</strong> {selectedCourse ? `${selectedCourse.course_code} — ${selectedCourse.course_name}` : <em>Chưa</em>}</div>
                    <div className="mt-1"><strong>Ngày đã chọn:</strong> {selectedDate ? ddmmyyyy(selectedDate) : <em>Chưa</em>}</div>
                    <div className="mt-1"><strong>Cơ sở:</strong> {activeCampus === 'all' ? 'Tất cả' : `CS${activeCampus}`}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* MAIN: compact calendar + details */}
            <div className="col-span-8">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconCalendar className="h-5 w-5 text-primary" />
                      <span className="text-sm">Lịch tháng {viewMonth + 1} / {viewYear}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-md border" onClick={goPrevMonth}><ChevronLeft className="h-4 w-4" /></button>
                      <button className="p-2 rounded-md border text-sm" onClick={goToday}>Hôm nay</button>
                      <button className="p-2 rounded-md border" onClick={goNextMonth}><ChevronRight className="h-4 w-4" /></button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="grid grid-cols-7 gap-1 text-center font-medium text-xs mb-2">
                      {renderWeekdayNames.map(w => <div key={w} className="py-1">{w}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {daysInView.map((d, idx) => {
                        if (!d) {
                          return <div key={`blank-${idx}`} className="h-12 rounded-md bg-transparent border border-dashed border-slate-200/5"></div>;
                        }
                        const todayStr = (new Date()).toDateString();
                        const isToday = todayStr === d.toDateString();
                        const isSelected = selectedDate ? (selectedDate.toDateString() === d.toDateString()) : false;
                        const hasEvents = badgesForDate(d).length > 0;
                        return (
                          <button
                            key={d.toISOString()}
                            onClick={() => handleSelectDate(d)}
                            className={`h-12 flex items-center justify-center rounded-md text-sm cursor-pointer border ${isSelected ? 'ring-2 ring-blue-400/40 bg-blue-600/5' : ''} ${isToday && !isSelected ? 'bg-yellow-400/5' : ''} hover:bg-slate-800/5`}
                            aria-pressed={isSelected}
                            title={ddmmyyyy(d)}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <div className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>{d.getDate()}</div>
                              {/* subtle dot indicator if event exists */}
                              <div className={`h-1 w-1 rounded-full ${hasEvents ? 'bg-primary' : 'bg-transparent'}`} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{selectedCourse ? `Lịch môn ${selectedCourse.course_code}` : (selectedDate ? `Lịch ngày ${ddmmyyyy(selectedDate)}` : `Lịch ngày ${ddmmyyyy(today)}`)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground">Kết quả: </span>
                      <span className="font-semibold">{combinedItems.length}</span>
                      <span className="text-sm text-muted-foreground ml-2"> (lọc theo cơ sở: {activeCampus === 'all' ? 'Tất cả' : `CS${activeCampus}`})</span>
                    </div>

                    {combinedItems.length === 0 && (
                      <div className="text-muted-foreground">Không có lớp theo lựa chọn hiện tại.</div>
                    )}

                    <div className="space-y-3">
                      {combinedItems.map((it, i) => (
                        <div key={i} className="p-3 rounded-md border bg-slate-800/20">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-semibold">{it.course.course_code} — {it.course.course_name}</div>
                              <div className="text-xs text-muted-foreground mt-1">Nhóm: {it.group.group_name} • Giảng viên: {cleanText(it.group.lecturer) || "Chưa phân công"}</div>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              CS: {it.schedule.cs || '-'}<br />
                              Phòng: {cleanText(it.schedule.phong) || '-'}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">Tiết: {cleanText(it.schedule.tiet) || '-'} • Tuần: {cleanText(it.schedule.tuan_hoc) || '-'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
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
