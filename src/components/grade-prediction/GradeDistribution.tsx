import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GradeDistributionProps {
  gradeMap: Record<string, number>;
}

export const GradeDistribution = ({ gradeMap }: GradeDistributionProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Thống kê số lượng môn theo đi��m chữ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          {Object.entries(gradeMap).map(([grade, count]) => (
            <div
              key={grade}
              className="flex flex-col items-center justify-center w-16 sm:w-20 p-2 sm:p-4 bg-muted rounded-lg shadow-sm"
            >
              <div className="text-lg sm:text-2xl font-bold text-foreground">{count}</div>
              <div
                className={`text-sm font-medium mt-1 ${
                  grade.startsWith("A") ? "text-education-primary" :
                  grade.startsWith("B") ? "text-education-secondary" :
                  grade.startsWith("C") ? "text-education-accent" :
                  "text-destructive"
                }`}
              >
                {grade}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
