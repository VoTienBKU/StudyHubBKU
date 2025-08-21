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
    
    // Mở cửa sổ popup
    const popup = window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    if (!popup) {
      toast({
        title: "Lỗi",
        description: "Không thể mở cửa sổ popup. Vui lòng kiểm tra popup blocker.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Thông báo hướng dẫn cho người dùng
    toast({
      title: "Hướng dẫn",
      description: "Đã mở cửa sổ MyBK. Sau khi đăng nhập và tải dữ liệu xong, hãy nhấn 'Lấy dữ liệu từ cửa sổ'",
    });

    setIsLoading(false);
  };

  const handleFetchDataFromWindow = () => {
    try {
      // Thử lấy dữ liệu từ localStorage (nếu website lưu ở đó)
      const storageData = localStorage.getItem('DANHSACH_MONHOC_CTDT');
      if (storageData) {
        try {
          const data = JSON.parse(storageData);
          setMonHocList(data);
          toast({
            title: "Thành công",
            description: `Đã lấy được ${data.length} môn học từ localStorage`,
          });
          return;
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }

      // Thử lấy từ window object
      const globalWindow = window as any;
      if (globalWindow.DANHSACH_MONHOC_CTDT) {
        setMonHocList(globalWindow.DANHSACH_MONHOC_CTDT);
        toast({
          title: "Thành công",
          description: `Đã lấy được ${globalWindow.DANHSACH_MONHOC_CTDT.length} môn học từ window`,
        });
        return;
      }

      // Hướng dẫn người dùng copy dữ liệu thủ công
      toast({
        title: "Hướng dẫn lấy dữ liệu",
        description: "Mở Developer Tools (F12) trong cửa sổ MyBK, gõ 'DANHSACH_MONHOC_CTDT' trong Console và copy kết quả vào ô bên dưới",
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy dữ liệu tự động. Vui lòng copy dữ liệu thủ công.",
        variant: "destructive"
      });
    }
  };

  const handleManualDataInput = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        setMonHocList(data);
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
      mon.diemSo > 0 && mon.soTinChi > 0 && mon.hieuLuc === "1"
    );
    
    if (validSubjects.length === 0) return 0;
    
    const totalPoints = validSubjects.reduce((sum, mon) => sum + (mon.diemSo * mon.soTinChi), 0);
    const totalCredits = validSubjects.reduce((sum, mon) => sum + mon.soTinChi, 0);
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const getTotalCredits = () => {
    return monHocList
      .filter(mon => mon.hieuLuc === "1" && mon.soTinChi > 0)
      .reduce((sum, mon) => sum + mon.soTinChi, 0);
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
                <Button 
                  variant="outline"
                  onClick={handleFetchDataFromWindow}
                  className="flex items-center space-x-2"
                >
                  <BarChart className="h-4 w-4" />
                  <span>Lấy dữ liệu từ cửa sổ</span>
                </Button>
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
                              <span className={`text-xs px-2 py-1 rounded ${
                                mon.hieuLuc === "1" ? "bg-education-secondary/20 text-education-secondary" : "bg-muted text-muted-foreground"
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