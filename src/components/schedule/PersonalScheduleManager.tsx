import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface PersonalScheduleEntry {
  semester: string;
  courseCode: string;
  courseName: string;
  credits: number;
  practicalCredits: number;
  group: string;
  day: string;
  timePeriod: string;
  timeRange: string;
  room: string;
  campus: string;
  weeks: string;
}

const parsePersonalScheduleData = (data: string): PersonalScheduleEntry[] => {
  const lines = data.trim().split('\n');
  return lines.map(line => {
    const parts = line.split('\t');
    if (parts.length >= 12) {
      return {
        semester: parts[0],
        courseCode: parts[1],
        courseName: parts[2],
        credits: parseInt(parts[3]) || 0,
        practicalCredits: parseInt(parts[4]) || 0,
        group: parts[5],
        day: parts[6],
        timePeriod: parts[7],
        timeRange: parts[8],
        room: parts[9],
        campus: parts[10],
        weeks: parts[11]
      };
    }
    return null;
  }).filter(Boolean) as PersonalScheduleEntry[];
};

const formatPersonalScheduleData = (entries: PersonalScheduleEntry[]): string => {
  return entries.map(entry => 
    [
      entry.semester,
      entry.courseCode,
      entry.courseName,
      entry.credits,
      entry.practicalCredits,
      entry.group,
      entry.day,
      entry.timePeriod,
      entry.timeRange,
      entry.room,
      entry.campus,
      entry.weeks
    ].join('\t')
  ).join('\n');
};

interface PersonalScheduleManagerProps {
  personalSchedule: PersonalScheduleEntry[];
  onUpdateSchedule: (schedule: PersonalScheduleEntry[]) => void;
}

export const PersonalScheduleManager: React.FC<PersonalScheduleManagerProps> = ({
  personalSchedule = [], // Provide default empty array
  onUpdateSchedule
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputData, setInputData] = useState("");

  const handleAddSchedule = () => {
    if (!inputData.trim()) return;
    
    const newEntries = parsePersonalScheduleData(inputData);
    const safeSchedule = Array.isArray(personalSchedule) ? personalSchedule : [];
    const updatedSchedule = [...safeSchedule, ...newEntries];
    onUpdateSchedule(updatedSchedule);
    setInputData("");
  };

  const handleRemoveEntry = (index: number) => {
    const safeSchedule = Array.isArray(personalSchedule) ? personalSchedule : [];
    const updatedSchedule = safeSchedule.filter((_, i) => i !== index);
    onUpdateSchedule(updatedSchedule);
  };

  const handleClearAll = () => {
    onUpdateSchedule([]);
  };

  const groupedByDay = (Array.isArray(personalSchedule) ? personalSchedule : []).reduce((acc, entry, index) => {
    const day = entry.day === '--' ? 'Không xác định' : `Thứ ${entry.day}`;
    if (!acc[day]) acc[day] = [];
    acc[day].push({ ...entry, originalIndex: index });
    return acc;
  }, {} as Record<string, (PersonalScheduleEntry & { originalIndex: number })[]>);

  return (
    <Card className="mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Thời khóa biểu cá nhân ({Array.isArray(personalSchedule) ? personalSchedule.length : 0} môn)</span>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Input section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Thêm môn học (định dạng tab-separated):</label>
              <Textarea
                placeholder="Ví dụ: 20251	CO4029	Đồ án Chuyên ngành	2	2	L02	--	--	--	------	BK	35|36|37|38|39|40|41|42|--|44|45|46|47|48|49|50|"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddSchedule} disabled={!inputData.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm môn
                </Button>
                {Array.isArray(personalSchedule) && personalSchedule.length > 0 && (
                  <Button variant="destructive" onClick={handleClearAll}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa tất cả
                  </Button>
                )}
              </div>
            </div>

            {/* Schedule display */}
            {personalSchedule.length > 0 && (
              <div className="space-y-4">
                {Object.entries(groupedByDay).map(([day, entries]) => (
                  <div key={day} className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">{day}</h4>
                    <div className="space-y-2">
                      {entries.map((entry) => (
                        <div
                          key={`${entry.courseCode}-${entry.group}-${entry.originalIndex}`}
                          className="flex items-start justify-between p-3 border rounded-lg bg-muted/30"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary">{entry.courseCode}</Badge>
                              <Badge variant="outline">{entry.group}</Badge>
                              {entry.campus !== '--' && <Badge>{entry.campus}</Badge>}
                            </div>
                            <p className="font-medium text-sm">{entry.courseName}</p>
                            <div className="text-xs text-muted-foreground space-y-1">
                              {entry.timeRange !== '--' && (
                                <p>⏰ {entry.timeRange} (Tiết {entry.timePeriod})</p>
                              )}
                              {entry.room !== '------' && entry.room !== '--' && (
                                <p>📍 Phòng {entry.room}</p>
                              )}
                              <p>📅 Tuần: {entry.weeks}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEntry(entry.originalIndex)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(!Array.isArray(personalSchedule) || personalSchedule.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Chưa có môn học nào trong thời khóa biểu cá nhân</p>
                <p className="text-sm mt-1">Thêm môn học bằng cách dán dữ liệu ở trên</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};