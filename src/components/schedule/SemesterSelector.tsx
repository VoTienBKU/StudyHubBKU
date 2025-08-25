import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SemesterSelectorProps {
  selectedSemester: string;
  onSemesterChange: (semester: string) => void;
  availableSemesters: string[];
}

export const SemesterSelector: React.FC<SemesterSelectorProps> = ({
  selectedSemester,
  onSemesterChange,
  availableSemesters
}) => {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-foreground mb-2 block">
        Chọn kì học
      </label>
      <Select value={selectedSemester} onValueChange={onSemesterChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn kì học" />
        </SelectTrigger>
        <SelectContent>
          {availableSemesters.map((semester) => (
            <SelectItem key={semester} value={semester}>
              {semester}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};