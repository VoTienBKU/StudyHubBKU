import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Schedule {
  thu?: string;
  tiet?: string;
  phong?: string;
  cs?: string;
  tuan_hoc?: string;
}

interface Group {
  lt_group: string;
  lecturer?: string;
  bt_lecturer?: string;
}

interface Course {
  id: string;
  course_code: string;
  course_name: string;
}

interface ScheduleItem {
  course: Course;
  group: Group;
  schedule: Schedule;
}

interface ScheduleResultsProps {
  items: ScheduleItem[];
  filterByDate: boolean;
  activeCampus: string;
  selectedCourse: Course | null;
  groupedByWeekday?: Record<string, ScheduleItem[]>;
  groupedForSelectedCourse?: Record<string, ScheduleItem[]>;
}

const cleanText = (t?: string) => {
  if (!t) return '';
  return String(t).replace(/\s+/g, ' ').trim();
};

const parseTietToRange = (tietStr?: string) => {
  if (!tietStr) return null;
  const nums = (tietStr.match(/\d+/g) || []).map(x => Number(x));
  if (nums.length === 0) return null;
  const minP = Math.min(...nums);
  const maxP = Math.max(...nums);
  const start = 6 * 60 + (minP - 1) * 60;
  const end = 6 * 60 + maxP * 60;
  const h1 = Math.floor(start / 60);
  const m1 = String(start % 60).padStart(2, '0');
  const h2 = Math.floor(end / 60);
  const m2 = String(end % 60).padStart(2, '0');
  return `${String(h1).padStart(2, '0')}:${m1} - ${String(h2).padStart(2, '0')}:${m2}`;
};

const ScheduleCard = ({ item }: { item: ScheduleItem }) => {
  return (
    <div className="p-2 sm:p-3 rounded-md border bg-slate-800/20">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">
            {item.course.course_code} — {item.course.course_name}
          </div>
                    <div className="flex flex-wrap gap-2 mt-1">
            <span className="px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-slate-500 text-slate-100">
              NHÓM - TỔ: {cleanText(item.group.lt_group) || 'Chưa phân công'}
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-slate-500 text-slate-100">
              Giảng viên: {cleanText(item.group.lecturer) || 'Chưa phân công'}
            </span>
            {(!item.schedule.thu && !item.schedule.tiet && !item.schedule.phong) ? (
              <span className="px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-200">
                Chưa có thông tin lịch học
              </span>
            ) : (
              <>
                <span className="px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-100">
                  Phòng: {cleanText(item.schedule.phong) || 'Chưa có dữ liệu'}
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-100">
                  Thời gian: {parseTietToRange(item.schedule.tiet) || 'Chưa có dữ liệu'}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          CS: {item.schedule?.cs || 'Chưa có dữ liệu'}<br />
          Nhóm: {item.group.lt_group || 'Chưa phân công'}
        </div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground space-y-1">
        <div>
          Tiết: {cleanText(item.schedule?.tiet) || 'Chưa có dữ liệu'} • 
          Tuần: {cleanText(item.schedule?.tuan_hoc) || 'Chưa có dữ liệu'}
        </div>
      </div>
    </div>
  );
};

export const ScheduleResults = ({
  items,
  filterByDate,
  activeCampus,
  selectedCourse,
  groupedByWeekday,
  groupedForSelectedCourse
}: ScheduleResultsProps) => {
  const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật', 'Không rõ'];

  return (
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
          <span className="font-semibold">{items.length}</span>
          <span className="text-sm text-muted-foreground ml-2">
            (lọc: {filterByDate ? 'có' : 'không'} theo ngày; {activeCampus === 'all' ? 'Tất cả cơ sở' : `CS${activeCampus}`})
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-muted-foreground">Không có kết quả theo lựa chọn hiện tại.</div>
        ) : (
          <div className="space-y-3">
            {!filterByDate && selectedCourse && groupedForSelectedCourse && Object.entries(groupedForSelectedCourse).some(([_, items]) => items.length > 0) ? (
              // Hiển thị kết quả được nhóm theo thứ cho môn học được chọn
              <div className="space-y-4">
                {['Chưa có lịch', ...weekdays, 'Không rõ'].map((label) => {
                  const list = groupedForSelectedCourse[label] || [];
                  if (list.length === 0) return null;
                  return (
                    <div key={label}>
                      <div className="text-sm font-semibold mb-2">{label} ({list.length})</div>
                      <div className="space-y-2">
                        {list.map((item, i) => (
                          <ScheduleCard key={i} item={item} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : !filterByDate && groupedByWeekday && Object.entries(groupedByWeekday).some(([_, items]) => items.length > 0) ? (
              // Hiển thị kết quả được nhóm theo thứ cho tất cả môn học
              <div className="space-y-4">
                {['Chưa có lịch', ...weekdays, 'Không rõ'].map((label) => {
                  const list = groupedByWeekday[label] || [];
                  if (list.length === 0) return null;
                  return (
                    <div key={label}>
                      <div className="text-sm font-semibold mb-2">{label} ({list.length})</div>
                      <div className="space-y-2">
                        {list.map((item, i) => (
                          <ScheduleCard key={i} item={item} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Hiển thị tất cả kết quả không được nhóm
              <div className="space-y-2">
                {items.map((item, i) => (
                  <ScheduleCard key={i} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
