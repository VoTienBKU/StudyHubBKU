import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface MonHoc {
  diemChu: string;
  diemSo: number;
  hieuLuc: string;
  maMonHoc: string;
  soTinChi: number;
  tenMonHoc: string;
  uniqueid: string;
}

interface SubjectListProps {
  monHocList: MonHoc[];
}

export const SubjectList = ({ monHocList }: SubjectListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Danh sách môn học</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Mã môn</th>
                <th className="text-left p-2">Tên môn học</th>
                <th className="text-center p-2">Tín chỉ</th>
                <th className="text-center p-2">Điểm số</th>
                <th className="text-center p-2">Điểm chữ</th>
                <th className="text-center p-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {monHocList.map((mon, index) => (
                <tr key={mon.uniqueid || index} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-mono text-sm">{mon.maMonHoc}</td>
                  <td className="p-2">{mon.tenMonHoc}</td>
                  <td className="p-2 text-center">{mon.soTinChi}</td>
                  <td className="p-2 text-center">
                    <span className={mon.diemSo >= 5 ? "text-education-secondary" : "text-destructive"}>
                      {mon.diemSo > 0 ? mon.diemSo : '--'}
                    </span>
                  </td>
                  <td className="p-2 text-center">{mon.diemChu}</td>
                  <td className="p-2 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      mon.hieuLuc === "1" 
                        ? "bg-education-secondary/20 text-education-secondary" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {mon.hieuLuc === "1" ? "Hiệu lực" : "Không hiệu lực"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
