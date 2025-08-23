import React, { useMemo } from "react";
import Layout from "@/components/Layout";
import { SearchAndFilter } from "@/components/schedule/SearchAndFilter";
<<<<<<< HEAD
import { MiniCalendar } from "@/components/schedule/MiniCalendar";
import { ScheduleResults } from "@/components/schedule/ScheduleResults";
import { useScheduleState } from "@/hooks/useScheduleState";
import coursesData from "@/data/course_sched.json";
=======
import { ScheduleResults } from "@/components/schedule/ScheduleResults";
import { useScheduleState } from "@/hooks/useScheduleState";
import coursesData from "@/data/course_sched.json";
import { useCourseSearch } from "@/hooks/useCourseSearch";
>>>>>>> refs/remotes/origin/main
import {
  buildScheduleOccurrencesCache,
  isScheduleOnDate,
  parseWeekdayToIndex,
  cleanText,
  getDaysArrayOfMonth,
  WEEKDAY_LABELS
} from "@/utils/scheduleUtils";
import type { Course } from "@/utils/localStorage";

interface Group {
<<<<<<< HEAD
  group_name: string;
=======
  lt_group: string;
>>>>>>> refs/remotes/origin/main
  lecturer?: string;
  bt_lecturer?: string;
  schedules?: Schedule[];
}

interface Schedule {
  thu?: string;
  tiet?: string;
  phong?: string;
  cs?: string;
  tuan_hoc?: string;
}

interface ScheduleItem {
  course: Course;
  group: Group;
  schedule: Schedule;
}

const Schedule = () => {
<<<<<<< HEAD
  const COURSES = useMemo(() => coursesData as Course[] || [], []);
=======
  const COURSES = useMemo(() => (coursesData as Course[]) || [], []);
>>>>>>> refs/remotes/origin/main

  // Use the custom hook for state management
  const {
    searchQ,
    activeCampus,
    selectedLecturer,
    filterByDate,
    selectedDate,
    viewMonth,
    viewYear,
    selectedCourse,
    setSearchQ,
    setActiveCampus,
    setSelectedLecturer,
    setFilterByDate,
    setSelectedDate,
    setViewMonth,
    setViewYear,
    setSelectedCourse,
    clearAllFilters
  } = useScheduleState();

<<<<<<< HEAD
  // Cache schedule occurrences
  const scheduleOccurrencesCache = useMemo(() => buildScheduleOccurrencesCache(COURSES), [COURSES]);

  // Search results state
  const [searchResults, setSearchResults] = useState<Course[]>([]);

  // Search effect
  useEffect(() => {
    const q = (searchQ || "").trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      return;
    }
    const matches = COURSES.filter(c => 
      (c.course_code || '').toLowerCase().includes(q) || 
      (c.course_name || '').toLowerCase().includes(q)
    );
    setSearchResults(matches);
  }, [searchQ, COURSES]);
=======
  // Optimized search hook (Fuse.js + debounce / fast-path)
  const { results: searchedCourses } = useCourseSearch(COURSES, searchQ, { debounceMs: 200, limit: 300 });

  // Cache schedule occurrences
  const scheduleOccurrencesCache = useMemo(() => buildScheduleOccurrencesCache(COURSES), [COURSES]);
>>>>>>> refs/remotes/origin/main

  // Get lecturers for selected course
  const lecturersForSelectedCourse = useMemo(() => {
    if (!selectedCourse) return [];
    const set = new Set<string>();
    for (const g of selectedCourse.list_group || []) {
      const a = cleanText(g.lecturer || "");
      const b = cleanText(g.bt_lecturer || "");
      if (a && !/chưa|đang phân công/i.test(a)) set.add(a);
      if (b && !/chưa|đang phân công/i.test(b)) set.add(b);
    }
    return Array.from(set).sort();
  }, [selectedCourse]);

  // Check if lecturer matches
  const lecturerMatches = (group: Group) => {
<<<<<<< HEAD
    if (!selectedLecturer || selectedLecturer === 'all') return true;
    const a = cleanText(group.lecturer || '');
    const b = cleanText(group.bt_lecturer || '');
=======
    if (!selectedLecturer || selectedLecturer === "all") return true;
    const a = cleanText(group.lecturer || "");
    const b = cleanText(group.bt_lecturer || "");
>>>>>>> refs/remotes/origin/main
    return (a && a === selectedLecturer) || (b && b === selectedLecturer);
  };

  // Get combined items
  const combinedItems = useMemo(() => {
    const items: ScheduleItem[] = [];
<<<<<<< HEAD
    
    const pushIfMatch = (course: Course, group: Group, schedule: Schedule) => {
      if (activeCampus !== 'all' && String(schedule.cs) !== String(activeCampus)) return;
=======

    const pushIfMatch = (course: Course, group: Group, schedule: Schedule) => {
      if (activeCampus !== "all" && String(schedule.cs) !== String(activeCampus)) return;
>>>>>>> refs/remotes/origin/main
      items.push({ course, group, schedule });
    };

    if (selectedCourse) {
      for (const g of selectedCourse.list_group || []) {
        if (!lecturerMatches(g)) continue;
        for (const s of g.schedules || []) {
          if (filterByDate && selectedDate) {
            if (isScheduleOnDate(selectedCourse, g, s, selectedDate, scheduleOccurrencesCache)) {
              pushIfMatch(selectedCourse, g, s);
            }
          } else {
            pushIfMatch(selectedCourse, g, s);
          }
        }
      }
      return items;
    }

<<<<<<< HEAD
    if (searchResults.length > 0) {
      for (const course of searchResults) {
=======
    // use searchedCourses (from optimized hook) instead of local search state
    if (searchedCourses.length > 0) {
      for (const course of searchedCourses) {
>>>>>>> refs/remotes/origin/main
        for (const g of course.list_group || []) {
          for (const s of g.schedules || []) {
            if (filterByDate && selectedDate) {
              if (isScheduleOnDate(course, g, s, selectedDate, scheduleOccurrencesCache)) {
                pushIfMatch(course, g, s);
              }
            } else {
              pushIfMatch(course, g, s);
            }
          }
        }
      }
    }

    return items;
<<<<<<< HEAD
  }, [selectedCourse, selectedLecturer, selectedDate, filterByDate, searchResults, activeCampus, scheduleOccurrencesCache]);

  // Group items by weekday
  const groupedForSelectedCourse = useMemo(() => {
    if (!selectedCourse) return null;
    const map: Record<string, ScheduleItem[]> = {};
    WEEKDAY_LABELS.forEach(label => map[label] = []);
    map['Không rõ'] = [];
=======
  }, [selectedCourse, selectedLecturer, selectedDate, filterByDate, searchedCourses, activeCampus, scheduleOccurrencesCache]);

  // Group items by weekday (for selected course)
  const groupedForSelectedCourse = useMemo(() => {
    if (!selectedCourse) return null;
    const map: Record<string, ScheduleItem[]> = {};
    WEEKDAY_LABELS.forEach((label) => (map[label] = []));
    map["Không rõ"] = [];
>>>>>>> refs/remotes/origin/main

    for (const g of selectedCourse.list_group || []) {
      if (!lecturerMatches(g)) continue;
      for (const s of g.schedules || []) {
<<<<<<< HEAD
        if (activeCampus !== 'all' && String(s.cs) !== String(activeCampus)) continue;
        if (filterByDate && selectedDate && !isScheduleOnDate(selectedCourse, g, s, selectedDate, scheduleOccurrencesCache)) continue;
        
        const idx = parseWeekdayToIndex(s.thu);
        const label = (idx === null) ? 'Không rõ' : WEEKDAY_LABELS[idx];
=======
        if (activeCampus !== "all" && String(s.cs) !== String(activeCampus)) continue;
        if (filterByDate && selectedDate && !isScheduleOnDate(selectedCourse, g, s, selectedDate, scheduleOccurrencesCache)) continue;

        const idx = parseWeekdayToIndex(s.thu);
        const label = idx === null ? "Không rõ" : WEEKDAY_LABELS[idx];
>>>>>>> refs/remotes/origin/main
        map[label].push({ course: selectedCourse, group: g, schedule: s });
      }
    }
    return map;
  }, [selectedCourse, selectedLecturer, activeCampus, selectedDate, filterByDate, scheduleOccurrencesCache]);

  // Group combined items by weekday (general view)
  const groupedByWeekday = useMemo(() => {
    const map: Record<string, ScheduleItem[]> = {};
<<<<<<< HEAD
    WEEKDAY_LABELS.forEach(label => map[label] = []);
    map['Không rõ'] = [];

    for (const item of combinedItems) {
      const idx = parseWeekdayToIndex(item.schedule.thu);
      const label = (idx === null) ? 'Không rõ' : WEEKDAY_LABELS[idx];
=======
    WEEKDAY_LABELS.forEach((label) => (map[label] = []));
    map["Không rõ"] = [];

    for (const item of combinedItems) {
      const idx = parseWeekdayToIndex(item.schedule.thu);
      const label = idx === null ? "Không rõ" : WEEKDAY_LABELS[idx];
>>>>>>> refs/remotes/origin/main
      map[label].push(item);
    }
    return map;
  }, [combinedItems]);

  // Event handlers
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const clearSelection = () => {
    clearAllFilters();
<<<<<<< HEAD
    setSearchResults([]);
=======
>>>>>>> refs/remotes/origin/main
  };

  // Calendar navigation
  const goPrevMonth = () => {
<<<<<<< HEAD
    let m = viewMonth - 1, y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
=======
    let m = viewMonth - 1,
      y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
>>>>>>> refs/remotes/origin/main
    setViewMonth(m);
    setViewYear(y);
  };

  const goNextMonth = () => {
<<<<<<< HEAD
    let m = viewMonth + 1, y = viewYear;
    if (m > 11) { m = 0; y += 1; }
=======
    let m = viewMonth + 1,
      y = viewYear;
    if (m > 11) {
      m = 0;
      y += 1;
    }
>>>>>>> refs/remotes/origin/main
    setViewMonth(m);
    setViewYear(y);
  };

  const goToday = () => {
    const t = new Date();
    setViewMonth(t.getMonth());
    setViewYear(t.getFullYear());
    setSelectedDate(t);
    setFilterByDate(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFilterByDate(true);
    setViewMonth(date.getMonth());
    setViewYear(date.getFullYear());
  };

  const handleClearDate = () => {
    setSelectedDate(null);
    setFilterByDate(false);
  };

  const daysInView = useMemo(() => getDaysArrayOfMonth(viewMonth, viewYear), [viewMonth, viewYear]);

  // Check if any schedule exists on given date
  const hasEventsOnDate = (date: Date) => {
    for (const course of COURSES) {
      for (const g of course.list_group || []) {
        if (selectedCourse && course.id !== selectedCourse.id) continue;
        if (selectedCourse && !lecturerMatches(g)) continue;
        for (const s of g.schedules || []) {
<<<<<<< HEAD
          if (activeCampus !== 'all' && String(s.cs) !== String(activeCampus)) continue;
=======
          if (activeCampus !== "all" && String(s.cs) !== String(activeCampus)) continue;
>>>>>>> refs/remotes/origin/main
          if (isScheduleOnDate(course, g, s, date, scheduleOccurrencesCache)) return true;
        }
      }
    }
    return false;
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">Thời khóa biểu HCMUT</h1>
<<<<<<< HEAD
          <p className="text-sm text-muted-foreground">Các filter sẽ được lưu tự động trong máy</p>
=======
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

>>>>>>> refs/remotes/origin/main
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <SearchAndFilter
              searchQ={searchQ}
              onSearchChange={setSearchQ}
<<<<<<< HEAD
              searchResults={searchResults}
=======
              searchResults={searchedCourses}
>>>>>>> refs/remotes/origin/main
              onSelectCourse={handleSelectCourse}
              activeCampus={activeCampus}
              onCampusChange={setActiveCampus}
              selectedCourse={selectedCourse}
              lecturers={lecturersForSelectedCourse}
              selectedLecturer={selectedLecturer}
              onLecturerChange={setSelectedLecturer}
              onClear={clearSelection}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onClearDate={handleClearDate}
              filterByDate={filterByDate}
            />
<<<<<<< HEAD

{/* MiniCalendar hidden - date picker is now integrated in SearchAndFilter */}
=======
>>>>>>> refs/remotes/origin/main
          </div>

          <div className="lg:col-span-8">
            <ScheduleResults
              items={combinedItems}
              filterByDate={filterByDate}
              activeCampus={activeCampus}
              selectedCourse={selectedCourse}
              groupedByWeekday={groupedByWeekday}
              groupedForSelectedCourse={groupedForSelectedCourse}
            />
          </div>
        </div>
      </div>
    </Layout >
  );
};

export default Schedule;
