import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, ChevronDown, ChevronRight, FileText, Table } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  list_group?: Array<{
    lt_group: string;
    lecturer?: string;
    bt_lecturer?: string;
    schedules?: Array<{
      thu?: string;
      tiet?: string;
      phong?: string;
      cs?: string;
      tuan_hoc?: string;
    }>;
  }>;
}

interface ScheduleItem {
  course: Course;
  group: any;
  schedule: any;
}

interface CourseExtractorProps {
  combinedItems: ScheduleItem[];
  selectedCourse: Course | null;
  searchResults: Course[];
}

export const CourseExtractor: React.FC<CourseExtractorProps> = ({
  combinedItems,
  selectedCourse,
  searchResults
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [extractFormat, setExtractFormat] = useState<'simple' | 'detailed'>('simple');
  const { toast } = useToast();

  // Get the courses to extract from
  const coursesToExtract = selectedCourse 
    ? [selectedCourse] 
    : searchResults.length > 0 
      ? searchResults 
      : [];

  const extractSimpleFormat = () => {
    return coursesToExtract.map(course => 
      `${course.course_code}\t${course.course_name}`
    ).join('\n');
  };

  const extractDetailedFormat = () => {
    const lines: string[] = [];
    
    for (const item of combinedItems) {
      const { course, group, schedule } = item;
      
      // Format: CourseCode | CourseName | Group | Day | Period | Time | Room | Campus | Weeks
      const line = [
        course.course_code || '',
        course.course_name || '',
        group.lt_group || '',
        schedule.thu || '--',
        schedule.tiet || '--',
        '', // Time range would need to be calculated
        schedule.phong || '--',
        schedule.cs || '--',
        schedule.tuan_hoc || ''
      ].join('\t');
      
      lines.push(line);
    }
    
    return lines.join('\n');
  };

  const handleCopy = () => {
    const content = extractFormat === 'simple' ? extractSimpleFormat() : extractDetailedFormat();
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Đã sao chép",
        description: `Đã sao chép ${coursesToExtract.length} môn học vào clipboard`,
      });
    });
  };

  const handleDownload = () => {
    const content = extractFormat === 'simple' ? extractSimpleFormat() : extractDetailedFormat();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danh-sach-mon-hoc-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Đã tải xuống",
      description: `Đã tải xuống danh sách ${coursesToExtract.length} môn học`,
    });
  };

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Trích xuất danh sách môn học ({coursesToExtract.length} môn)</span>
              </div>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Format selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Định dạng:</label>
              <div className="flex gap-2">
                <Button
                  variant={extractFormat === 'simple' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExtractFormat('simple')}
                >
                  <Table className="h-4 w-4 mr-2" />
                  Đơn giản
                </Button>
                <Button
                  variant={extractFormat === 'detailed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExtractFormat('detailed')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </div>
            </div>

            {/* Preview */}
            {coursesToExtract.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Xem trước:</label>
                <Textarea
                  readOnly
                  value={extractFormat === 'simple' ? extractSimpleFormat() : extractDetailedFormat()}
                  rows={Math.min(10, coursesToExtract.length + 2)}
                  className="text-xs font-mono"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button onClick={handleCopy} disabled={coursesToExtract.length === 0}>
                <Copy className="h-4 w-4 mr-2" />
                Sao chép
              </Button>
              <Button onClick={handleDownload} disabled={coursesToExtract.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
            </div>

            {/* Info */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>Đơn giản:</strong> Chỉ mã môn và tên môn (tab-separated)</p>
              <p>• <strong>Chi tiết:</strong> Bao gồm nhóm, lịch học, phòng, cơ sở</p>
              {coursesToExtract.length === 0 && (
                <p className="text-amber-600">⚠️ Hãy tìm kiếm hoặc chọn môn học để trích xuất</p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};