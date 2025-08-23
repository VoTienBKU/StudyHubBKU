import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD
=======
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
>>>>>>> refs/remotes/origin/main

interface GradeDistributionProps {
  gradeMap: Record<string, number>;
}

export const GradeDistribution = ({ gradeMap }: GradeDistributionProps) => {
<<<<<<< HEAD
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
=======
  // Lọc bỏ grade có count = 0
  const data = Object.entries(gradeMap)
    .filter(([_, count]) => count > 0)
    .map(([grade, count]) => ({
      grade,
      count,
    }));

  // Bảng màu cố định (có thể thêm nhiều hơn nếu cần)
  const colors = [
    "#22c55e", // xanh lá
    "#3b82f6", // xanh dương
    "#f59e0b", // cam
    "#ef4444", // đỏ
    "#8b5cf6", // tím
    "#06b6d4", // cyan
    "#e11d48", // hồng
    "#84cc16", // xanh lá nhạt
    "#f97316", // cam sáng
    "#0ea5e9", // xanh nước biển
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Phân bố điểm chữ</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="grade"
                outerRadius={100}
                label
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={colors[idx % colors.length]} // mỗi grade 1 màu riêng
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground text-sm">
            Không có dữ liệu điểm chữ
          </p>
        )}
>>>>>>> refs/remotes/origin/main
      </CardContent>
    </Card>
  );
};
