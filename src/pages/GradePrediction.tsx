import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, BarChart, ExternalLink, BookOpen, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MonHoc {
  diemChu: string;
  diemDat: string;
  diemSo: number;
  doUuTien: number;
  ghiChu: string;
  hieuLuc: string;
  id: number;
  khoiKienThucid: number;
  maMonHoc: string;
  monHocTuongDuongId: string | null;
  soTinChi: number;
  tenMonHoc: string;
  uniqueid: string;
  xetTuChonTuDo: string | null;
}

const GradePrediction = () => {
  const [url, setUrl] = useState("https://mybk.hcmut.edu.vn/app/sinh-vien/ket-qua-hoc-tap/chuong-trinh-dao-tao");
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOpenAndFetchData = () => {
    if (!url.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL hợp lệ",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Mở tab mới
    const newTab = window.open(url, '_blank');

    if (!newTab) {
      toast({
        title: "Lỗi",
        description: "Không thể mở tab mới. Vui lòng kiểm tra popup blocker.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Thông báo hướng dẫn cho người dùng
    toast({
      title: "Hướng dẫn",
      description: "Đã mở tab MyBK. Sau khi đăng nhập và tải dữ liệu xong, hãy nhấn 'Lấy dữ liệu từ tab'",
    });

    setIsLoading(false);
  };

  const handleManualDataInput = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        setMonHocList(
          Array.from(
            new Map(
              data
                .filter((mon: MonHoc) => mon.diemSo <= 50 && mon.soTinChi > 0)
                .sort((a: MonHoc, b: MonHoc) => b.diemSo - a.diemSo)
                .map((mon: MonHoc) => [mon.maMonHoc, mon])
            ).values()
          )
        );
        toast({
          title: "Thành công",
          description: `Đã import ${data.length} môn học`,
        });
      } else {
        throw new Error("Dữ liệu không đúng định dạng array");
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Dữ liệu JSON không hợp lệ",
        variant: "destructive"
      });
    }
  };

  const calculateGPA = () => {
    if (monHocList.length === 0) return 0;

    const validSubjects = monHocList.filter(mon =>
      mon.diemSo > 0 && mon.diemSo <= 10 && mon.soTinChi > 0 && mon.hieuLuc === "1"
    );

    if (validSubjects.length === 0) return 0;

    const totalPoints = validSubjects.reduce((sum, mon) => sum + (mon.diemSo * mon.soTinChi), 0);
    const totalCredits = validSubjects.reduce((sum, mon) => sum + mon.soTinChi, 0);

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(3) : 0;
  };

  const getTotalCredits = () => {
    return monHocList
      .filter(mon => mon.hieuLuc === "1" && mon.soTinChi > 0)
      .reduce((sum, mon) => sum + mon.soTinChi, 0);
  };

  const countGrades = () => {
    const grades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D"];
    const gradeMap: Record<string, number> = {};
    grades.forEach(g => (gradeMap[g] = 0));

    monHocList.forEach(mon => {
      if (mon.diemSo > 0 && mon.diemSo <= 10 && mon.hieuLuc === "1") {
        if (gradeMap[mon.diemChu] !== undefined) {
          gradeMap[mon.diemChu]++;
        }
      }
    });

    return gradeMap;
  };


  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dự đoán điểm trung bình
            </h1>
            <p className="text-muted-foreground">
              Nhập URL MyBK để phân tích và dự báo kết quả học tập
            </p>
          </div>

          {/* URL Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                <span>Kết nối với MyBK</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url">URL MyBK</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://mybk.hcmut.edu.vn/..."
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleOpenAndFetchData}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Mở MyBK</span>
                </Button>

              </div>

              {/* Hướng dẫn hiển thị luôn */}
              <div className="mt-4 p-4 bg-muted/20 text-muted-foreground rounded-md text-sm space-y-2">
                <p>Hướng dẫn lấy dữ liệu từ MyBK:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Nhấn nút "Mở MyBK" để mở tab MyBK.</li>
                  <li>Đăng nhập vào MyBK nếu chưa đăng nhập.</li>
                  <li>Tải dữ liệu điểm và thông tin các môn học trong MyBK.</li>
                  <li>Quay lại trang này và nhấn "Lấy dữ liệu từ cửa sổ".</li>
                  <li>Nếu không lấy được tự động, mở Developer Tools (F12) trong tab MyBK, gõ <code>DANHSACH_MONHOC_CTDT</code> trong Console và copy dữ liệu JSON vào ô "Import dữ liệu thủ công".</li>
                </ol>
              </div>
            </CardContent>
          </Card>


          {/* Manual Data Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Import dữ liệu thủ công</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="manual-data">Paste dữ liệu JSON từ DANHSACH_MONHOC_CTDT</Label>
                <textarea
                  id="manual-data"
                  className="w-full h-32 p-3 border rounded-md resize-none"
                  placeholder='Paste dữ liệu JSON array tại đây...'
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      handleManualDataInput(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {monHocList.length > 0 && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calculator className="h-12 w-12 text-primary mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-foreground">{calculateGPA()}</h3>
                    <p className="text-muted-foreground">Điểm TB hiện tại</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-12 w-12 text-accent mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-foreground">{getTotalCredits()}</h3>
                    <p className="text-muted-foreground">Tổng số tín chỉ</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-12 w-12 text-education-secondary mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-foreground">{monHocList.length}</h3>
                    <p className="text-muted-foreground">Tổng số môn học</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Thống kê số lượng môn theo điểm chữ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {Object.entries(countGrades()).map(([grade, count]) => (
                      <div
                        key={grade}
                        className="flex flex-col items-center justify-center w-20 p-4 bg-muted rounded-lg shadow-sm"
                      >
                        <div className="text-2xl font-bold text-foreground">{count}</div>
                        <div
                          className={`text-sm font-medium mt-1 ${grade.startsWith("A") ? "text-education-primary" :
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
              {/* Subject List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Danh sách môn học</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
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
                              <span className={`text-xs px-2 py-1 rounded ${mon.hieuLuc === "1" ? "bg-education-secondary/20 text-education-secondary" : "bg-muted text-muted-foreground"
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GradePrediction;