import { Card, CardContent } from "@/components/ui/card";
import { Calculator, BookOpen, TrendingUp } from "lucide-react";

interface GPAStatsProps {
  gpa10: string;
  gpa4: string;
  totalCredits: number;
  totalSubjects: number;
  totalRequiredCredits?: number; // Optional for backward compatibility
}

export const GPAStats = ({ gpa10, gpa4, totalCredits, totalSubjects }: GPAStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
      <Card>
        <CardContent className="p-3 sm:p-6 text-center">
          <Calculator className="h-8 sm:h-12 w-8 sm:w-12 text-primary mx-auto mb-2" />
          <h3 className="text-lg sm:text-2xl font-bold text-foreground">{gpa10} / 10</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Hệ 10</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6 text-center">
          <Calculator className="h-8 sm:h-12 w-8 sm:w-12 text-accent mx-auto mb-2" />
          <h3 className="text-lg sm:text-2xl font-bold text-foreground">{gpa4} / 4</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Hệ 4</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6 text-center">
          <BookOpen className="h-8 sm:h-12 w-8 sm:w-12 text-accent mx-auto mb-2" />
          <h3 className="text-lg sm:text-2xl font-bold text-foreground">{totalCredits}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Tổng số tín chỉ</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6 text-center">
          <TrendingUp className="h-8 sm:h-12 w-8 sm:w-12 text-education-secondary mx-auto mb-2" />
          <h3 className="text-lg sm:text-2xl font-bold text-foreground">{totalSubjects}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Tổng số môn học</p>
        </CardContent>
      </Card>
    </div>
  );
};
