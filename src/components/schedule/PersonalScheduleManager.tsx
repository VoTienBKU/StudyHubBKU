import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SemesterSelector } from "./SemesterSelector";
import { 
  PersonalScheduleEntry, 
  savePersonalSchedule, 
  loadPersonalSchedule,
  saveSelectedSemester,
  loadSelectedSemester
} from "@/utils/localStorage";
import { Calendar, Plus, FileText } from "lucide-react";

interface PersonalScheduleManagerProps {
  onDataChange?: () => void;
}

export const PersonalScheduleManager: React.FC<PersonalScheduleManagerProps> = ({ onDataChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputData, setInputData] = useState("");
  
  // Initialize state with proper error handling
  const [personalSchedule, setPersonalSchedule] = useState<PersonalScheduleEntry[]>(() => {
    try {
      const data = loadPersonalSchedule();
      console.log("Loaded personal schedule:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error loading personal schedule:", error);
      return [];
    }
  });
  
  const [selectedSemester, setSelectedSemester] = useState<string>(() => {
    try {
      return loadSelectedSemester() || '';
    } catch (error) {
      console.error("Error loading selected semester:", error);
      return '';
    }
  });

  // Parse schedule data from MyBK format
  const parseScheduleData = (data: string): PersonalScheduleEntry[] => {
    const lines = data.trim().split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parts = line.split('\t');
      return {
        semester: parts[0] || '',
        course_code: parts[1] || '',
        course_name: parts[2] || '',
        credits: parseInt(parts[3]) || 0,
        practice_credits: parseInt(parts[4]) || 0,
        group: parts[5] || '',
        day: parts[6] || '',
        period: parts[7] || '',
        time: parts[8] || '',
        room: parts[9] || '',
        campus: parts[10] || '',
        weeks: parts[11] || ''
      };
    });
  };

  // Get available semesters with safety check
  const availableSemesters = useMemo(() => {
    try {
      if (!Array.isArray(personalSchedule)) {
        console.warn("personalSchedule is not an array:", personalSchedule);
        return [];
      }
      const semesters = new Set(personalSchedule.map(entry => entry.semester));
      return Array.from(semesters).sort();
    } catch (error) {
      console.error("Error calculating available semesters:", error);
      return [];
    }
  }, [personalSchedule]);

  // Filter schedule by selected semester with safety check
  const filteredSchedule = useMemo(() => {
    try {
      if (!Array.isArray(personalSchedule)) {
        console.warn("personalSchedule is not an array in filter:", personalSchedule);
        return [];
      }
      if (!selectedSemester) return personalSchedule;
      return personalSchedule.filter(entry => entry.semester === selectedSemester);
    } catch (error) {
      console.error("Error filtering schedule:", error);
      return [];
    }
  }, [personalSchedule, selectedSemester]);

  // Handle import
  const handleImport = () => {
    if (!inputData.trim()) return;

    try {
      const parsedData = parseScheduleData(inputData);
      const newSchedule = [...personalSchedule, ...parsedData];
      
      setPersonalSchedule(newSchedule);
      savePersonalSchedule(newSchedule);
      
      // Auto-select the first semester if none selected
      if (!selectedSemester && parsedData.length > 0) {
        const firstSemester = parsedData[0].semester;
        setSelectedSemester(firstSemester);
        saveSelectedSemester(firstSemester);
      }
      
      setInputData("");
      setIsDialogOpen(false);
      onDataChange?.();
    } catch (error) {
      console.error("Error parsing schedule data:", error);
    }
  };

  // Handle semester change
  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    saveSelectedSemester(semester);
  };

  // Group schedule by day with safety check
  const scheduleByDay = useMemo(() => {
    try {
      const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
      const grouped: Record<string, PersonalScheduleEntry[]> = {};
      
      days.forEach(day => {
        grouped[day] = [];
      });

      if (!Array.isArray(filteredSchedule)) {
        console.warn("filteredSchedule is not an array:", filteredSchedule);
        return grouped;
      }
      
      days.forEach(day => {
        grouped[day] = filteredSchedule.filter(entry => {
          const dayNum = entry.day;
          if (dayNum === '2') return day === 'Thứ 2';
          if (dayNum === '3') return day === 'Thứ 3';
          if (dayNum === '4') return day === 'Thứ 4';
          if (dayNum === '5') return day === 'Thứ 5';
          if (dayNum === '6') return day === 'Thứ 6';
          if (dayNum === '7') return day === 'Thứ 7';
          if (dayNum === '8' || dayNum === 'CN') return day === 'Chủ nhật';
          return false;
        }).sort((a, b) => {
          const periodA = parseInt(a.period.split(' - ')[0]) || 0;
          const periodB = parseInt(b.period.split(' - ')[0]) || 0;
          return periodA - periodB;
        });
      });
      
      return grouped;
    } catch (error) {
      console.error("Error grouping schedule by day:", error);
      return {};
    }
  }, [filteredSchedule]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Thời khóa biểu cá nhân
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nhập dữ liệu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nhập dữ liệu thời khóa biểu từ MyBK</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Dán dữ liệu từ MyBK (định dạng tab-separated):
                  </label>
                  <Textarea
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    placeholder="20251	CO4029	Đồ án Chuyên ngành	2	2	L02	--	--	--	------	BK	35|36|37|38|39|40|41|42|--|44|45|46|47|48|49|50|"
                    className="mt-2 min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleImport}>
                    Nhập dữ liệu
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {availableSemesters.length > 0 && (
          <SemesterSelector
            selectedSemester={selectedSemester}
            onSemesterChange={handleSemesterChange}
            availableSemesters={availableSemesters}
          />
        )}

        {filteredSchedule.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có dữ liệu thời khóa biểu</p>
            <p className="text-sm">Nhấn "Nhập dữ liệu" để thêm thời khóa biểu từ MyBK</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(scheduleByDay).map(([day, entries]) => (
              entries.length > 0 && (
                <div key={day} className="space-y-2">
                  <h4 className="font-medium text-sm text-foreground border-b pb-1">
                    {day}
                  </h4>
                  <div className="space-y-2">
                    {entries.map((entry, index) => (
                      <div
                        key={`${entry.course_code}-${index}`}
                        className="bg-muted/50 p-3 rounded-lg text-sm space-y-1"
                      >
                        <div className="font-medium text-foreground">
                          {entry.course_code}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {entry.course_name}
                        </div>
                        <div className="text-xs space-y-0.5">
                          <div>Tiết: {entry.period}</div>
                          <div>Thời gian: {entry.time}</div>
                          <div>Phòng: {entry.room}</div>
                          <div>Nhóm: {entry.group}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};