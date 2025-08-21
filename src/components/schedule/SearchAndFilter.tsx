import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as IconCalendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  list_group?: Array<{
    group_name: string;
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
  filterByDate
}: SearchAndFilterProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  return (
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
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={searchQ}
              onChange={(e) => onSearchChange(e.target.value)}
            />

            {searchQ && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 max-h-48 overflow-auto bg-white border rounded-md shadow-lg">
                {searchResults.map(c => (
                  <div
                    key={c.id}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-100 cursor-pointer"
                    onClick={() => {
                      onSearchChange(`${c.course_code} — ${c.course_name}`);
                      onSelectCourse(c);
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

          <div className="flex gap-2">
            <button className="flex-1 rounded-md border px-3 py-2" onClick={onClear}>Clear</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
