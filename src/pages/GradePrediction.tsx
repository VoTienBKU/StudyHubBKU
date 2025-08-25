import { useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { GPAStats } from "@/components/grade-prediction/GPAStats";
import { GradeDistribution } from "@/components/grade-prediction/GradeDistribution";
import { SubjectList } from "@/components/grade-prediction/SubjectList";
import { MyBKConnection } from "@/components/grade-prediction/MyBKConnection";
import { ManualDataInput } from "@/components/grade-prediction/ManualDataInput";
import { KhoiKienThucStats } from "@/components/grade-prediction/KhoiKienThucStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateGPA,
  getTotalCredits,
  countGrades,
  processMonHocData,
  processMyBKData,
  gradePlanForTarget,
  getTotalRequiredCredits
} from "@/utils/gpaCalculations";

interface KhoiKienThuc {
  uniqueid: number;
  id: number;
  soThuTu: number;
  tenKhoiKienThuc: string;
  tinhTrangHoanThanh: string;
  loaiKhoiKienThuc: string;
  nhomKhoiKienThuc: string;
  soTinChiYeuCau: number;
  soTinChiDat: number;
  soMonHocYeuCau: number;
  soMonHocDat: number;
  batBuoc: string;
}

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
  const [khoiKienThucList, setKhoiKienThucList] = useState<KhoiKienThuc[]>([]);
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

    toast({
      title: "Hướng dẫn",
      description: "Đã mở tab MyBK. Sau khi đăng nhập và tải dữ liệu xong, hãy nhấn 'Lấy dữ liệu từ tab'",
    });

    setIsLoading(false);
  };

  const handleManualDataInput = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      let processedData: MonHoc[] = [];

      // Check if it's the new structure with DANHSACH_KHOIKIENTHUC and DANHSACH_MONHOC_CTDT
      if (data.DANHSACH_MONHOC_CTDT && Array.isArray(data.DANHSACH_MONHOC_CTDT)) {
        processedData = processMyBKData(data);

        // Process knowledge blocks if available
        if (data.DANHSACH_KHOIKIENTHUC && Array.isArray(data.DANHSACH_KHOIKIENTHUC)) {
          setKhoiKienThucList(data.DANHSACH_KHOIKIENTHUC);
        }

        toast({
          title: "Thành công",
          description: `Đã import ${processedData.length} môn học và ${data.DANHSACH_KHOIKIENTHUC?.length || 0} khối kiến thức`,
        });
      }
      // Backward compatibility: Check if it's an array (old structure)
      else if (Array.isArray(data)) {
        processedData = processMonHocData(data);
        toast({
          title: "Thành công",
          description: `Đã import ${processedData.length} môn học từ cấu trúc cũ`,
        });
      }
      else {
        throw new Error("Dữ liệu không đúng định dạng. Cần có DANHSACH_MONHOC_CTDT hoặc là array");
      }

      setMonHocList(processedData);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Dữ liệu JSON không hợp lệ. Vui lòng kiểm tra cấu trúc dữ liệu.",
        variant: "destructive"
      });
    }
  };

  const gpa = calculateGPA(monHocList);
  const totalCredits = getTotalCredits(monHocList);
  const gradeDistribution = countGrades(monHocList);
  const totalRequiredCredits = getTotalRequiredCredits(khoiKienThucList);

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dự đoán điểm trung bình
            </h1>
            <p className="text-sm text-muted-foreground">
              Chúng tôi cần sự <span className="font-medium text-foreground">feedback </span>
              và góp ý nhiều hơn để cải thiện tool.
              Tham gia nhóm:{" "}
              <a
                href="https://www.facebook.com/groups/khmt.ktmt.cse.bku"
                target="_blank"
                rel="noopener noreferrer"
                className="text-education-primary hover:underline"
              >
                Thảo luận kiến thức CNTT trường BK về KHMT(CScience), KTMT(CEngineering)
              </a>
            </p>
          </div>

          <MyBKConnection
            url={url}
            isLoading={isLoading}
            onUrlChange={setUrl}
            onOpenAndFetch={handleOpenAndFetchData}
          />

          <ManualDataInput onDataInput={handleManualDataInput} />

          {(monHocList.length > 0 || khoiKienThucList.length > 0) && (
            <>
              {khoiKienThucList.length > 0 && (
                <KhoiKienThucStats khoiKienThucList={khoiKienThucList} />
              )}

              {monHocList.length > 0 && (
                <>
                  <GPAStats
                    gpa10={gpa.gpa10}
                    gpa4={gpa.gpa4}
                    totalCredits={totalCredits}
                    totalSubjects={monHocList.length}
                    totalRequiredCredits={totalRequiredCredits > 0 ? totalRequiredCredits : undefined}
                  />

                  <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    {/* Biểu đồ bên trái */}
                    <div className="flex-1">
                      <GradeDistribution gradeMap={gradeDistribution} />
                    </div>

                    {/* Mục tiêu GPA bên phải */}
                    <div className="w-full lg:w-1/3">
                      <Card>
                        <CardHeader>
                          <CardTitle>Mục tiêu GPA</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div>
                              🎯 Giỏi (≥ 3.2):{" "}
                              {(() => {
                                const plan = gradePlanForTarget(
                                  typeof gpa.gpa4 === 'number' ? gpa.gpa4 : parseFloat(String(gpa.gpa4)) || 0,
                                  totalCredits,
                                  3.2,
                                  totalRequiredCredits
                                );
                                return plan
                                  ? Object.entries(plan)
                                    .filter(([_, count]) => count > 0)
                                    .map(([grade, count]) => `${count} tín chỉ ${grade}`)
                                    .join(", ")
                                  : "Không thể đạt được";
                              })()}
                            </div>

                            <div>
                              🏆 Xuất sắc (≥ 3.6):{" "}
                              {(() => {
                                const plan = gradePlanForTarget(
                                  typeof gpa.gpa4 === 'number' ? gpa.gpa4 : parseFloat(String(gpa.gpa4)) || 0,
                                  totalCredits,
                                  3.6,
                                  totalRequiredCredits
                                );
                                return plan
                                  ? Object.entries(plan)
                                    .filter(([_, count]) => count > 0)
                                    .map(([grade, count]) => `${count} tín chỉ ${grade}`)
                                    .join(", ")
                                  : "Không thể đạt được";
                              })()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <SubjectList monHocList={monHocList} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GradePrediction;
