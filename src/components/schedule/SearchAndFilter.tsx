import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as IconCalendar, ChevronDown, ChevronUp, List, BookOpen } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { PersonalScheduleEntry } from "@/utils/localStorage";

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  list_group?: Array<{
    lt_group: string;
    lecturer?: string;
    bt_lecturer?: string;
  }>;
}

interface SearchAndFilterProps {
  searchQ: string;
  onSearchChange: (query: string) => void;
  searchResults: Course[];
  onSelectCourse: (course: Course) => void;
  activeCampus: string;
  onCampusChange: (campus: string) => void;
  selectedCourse: Course | null;
  lecturers: string[];
  selectedLecturer: string;
  onLecturerChange: (lecturer: string) => void;
  onClear: () => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onClearDate: () => void;
  filterByDate: boolean;
  personalSchedule: PersonalScheduleEntry[];
}

export const SearchAndFilter = ({
  searchQ,
  onSearchChange,
  searchResults,
  onSelectCourse,
  activeCampus,
  onCampusChange,
  selectedCourse,
  lecturers,
  selectedLecturer,
  onLecturerChange,
  onClear,
  selectedDate,
  onDateSelect,
  onClearDate,
  filterByDate,
  personalSchedule
}: SearchAndFilterProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPersonalListOpen, setIsPersonalListOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      if (!(ev.target instanceof Node)) return;
      if (!containerRef.current.contains(ev.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When searchQ changes from parent, open dropdown if there are results
  useEffect(() => {
    if (searchQ && searchResults && searchResults.length > 0) {
      setIsDropdownOpen(true);
    } else {
      // do not force-close here if you want to keep it open for other reasons,
      // but safe to close when no results
      setIsDropdownOpen(false);
    }
  }, [searchQ, searchResults]);

  const handleInputChange = (v: string) => {
    // open dropdown on typing
    setIsDropdownOpen(true);
    onSearchChange(v);
  };

  const handleSelect = (c: Course) => {
    // set input to course_code (clean) so subsequent searches work predictably
    onSearchChange(c.course_code || `${c.course_code} — ${c.course_name}`);
    onSelectCourse(c);
    setIsDropdownOpen(false);
  };

  const handlePersonalCourseClick = (entry: PersonalScheduleEntry) => {
    onSearchChange(entry.courseCode);
    setIsPersonalListOpen(false);
  };

  // Get unique courses from personal schedule
  const uniquePersonalCourses = personalSchedule.reduce((acc, entry) => {
    const key = entry.courseCode;
    if (!acc.find(item => item.courseCode === key)) {
      acc.push(entry);
    }
    return acc;
  }, [] as PersonalScheduleEntry[]);

  return (
    <Card className="mb-4" ref={containerRef as any}>
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
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={searchQ}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => {
                if (searchResults && searchResults.length > 0) setIsDropdownOpen(true);
              }}
            />

            {isDropdownOpen && searchQ && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 max-h-96 overflow-auto bg-white border rounded-md shadow-lg">
                {searchResults.map(c => (
                  <div
                    key={c.id}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-100 cursor-pointer"
                    onClick={() => handleSelect(c)}
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

          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${activeCampus === 'all' ? 'bg-primary text-white' : 'bg-slate-100'}`}
              onClick={() => onCampusChange('all')}
            >
              Tất cả cơ sở
            </button>
            <button
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${activeCampus === '1' ? 'bg-primary text-white' : 'bg-slate-100'}`}
              onClick={() => onCampusChange('1')}
            >
              CS1
            </button>
            <button
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${activeCampus === '2' ? 'bg-primary text-white' : 'bg-slate-100'}`}
              onClick={() => onCampusChange('2')}
            >
              CS2
            </button>
          </div>

          {selectedCourse && lecturers.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-semibold mb-1">Giảng viên</div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <button
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${selectedLecturer === 'all' ? 'bg-primary text-white' : 'bg-slate-100'}`}
                  onClick={() => onLecturerChange('all')}
                >
                  Tất cả
                </button>
                {lecturers.map((lecturer, idx) => (
                  <button
                    key={idx}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${selectedLecturer === lecturer ? 'bg-primary text-white' : 'bg-slate-100'}`}
                    onClick={() => onLecturerChange(lecturer)}
                  >
                    {lecturer}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Picker Section */}
          <div className="mt-3">
            <button
              className="flex items-center justify-between w-full p-2 text-sm font-semibold rounded-md border hover:bg-muted/50"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            >
              <div className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                <span>Chọn ngày</span>
                {selectedDate && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {selectedDate.toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>
              {isDatePickerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {isDatePickerOpen && (
              <div className="mt-2 p-3 border rounded-md bg-muted/20">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 rounded-md border px-2 py-1 text-sm"
                      value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          onDateSelect(new Date(e.target.value));
                        }
                      }}
                    />
                    <button
                      className="px-3 py-1 text-xs rounded-md border bg-background hover:bg-muted"
                      onClick={() => onDateSelect(new Date())}
                    >
                      Hôm nay
                    </button>
                  </div>
                  {selectedDate && (
                    <button
                      className="w-full px-3 py-1 text-xs rounded-md border text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        onClearDate();
                        setIsDatePickerOpen(false);
                      }}
                    >
                      Bỏ chọn ngày
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 rounded-md border px-3 py-2"
              onClick={() => {
                onClear();
                setIsDropdownOpen(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
