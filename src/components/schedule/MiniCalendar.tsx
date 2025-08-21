import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as IconCalendar, ChevronLeft, ChevronRight } from "lucide-react";

interface MiniCalendarProps {
  viewMonth: number;
  viewYear: number;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onClearDate: () => void;
  hasEventsOnDate: (date: Date) => boolean;
  daysInView: (Date | null)[];
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const ddmmyyyy = (date: Date) => {
  const d = pad2(date.getDate());
  const m = pad2(date.getMonth() + 1);
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

export const MiniCalendar = ({
  viewMonth,
  viewYear,
  selectedDate,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  onToday,
  onClearDate,
  hasEventsOnDate,
  daysInView
}: MiniCalendarProps) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconCalendar className="h-4 w-4" />
            Chọn ngày
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border" onClick={onPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-xs px-2">{viewMonth + 1}/{viewYear}</div>
            <button className="p-1 rounded border" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs mb-2 grid grid-cols-7 gap-0.5 sm:gap-1 text-center font-medium">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(w => (
            <div key={w} className="py-1">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysInView.map((d, idx) => {
            if (!d) return <div key={`b-${idx}`} className="h-8 rounded text-xs" />;
            
            const isToday = (new Date()).toDateString() === d.toDateString();
            const isSelected = selectedDate ? selectedDate.toDateString() === d.toDateString() : false;
            const hasEvent = hasEventsOnDate(d);
            
            return (
              <button 
                key={d.toISOString()} 
                onClick={() => onDateSelect(d)}
                className={`h-8 rounded text-xs flex flex-col items-center justify-center ${
                  isSelected ? 'ring-2 ring-blue-400/40 bg-blue-600/5' : ''
                } ${isToday && !isSelected ? 'bg-yellow-400/5' : ''}`}
              >
                <div className={`text-sm ${isSelected ? 'font-semibold' : ''}`}>
                  {d.getDate()}
                </div>
                <div className={`h-1 w-1 rounded-full ${hasEvent ? 'bg-primary' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2">
          <button className="flex-1 rounded-md border px-2 py-1 text-sm" onClick={onClearDate}>
            Bỏ chọn
          </button>
          <button className="rounded-md border px-2 py-1 text-sm" onClick={onToday}>
            Hôm nay
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
