import { useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { GPAStats } from "@/components/grade-prediction/GPAStats";
import { GradeDistribution } from "@/components/grade-prediction/GradeDistribution";
import { SubjectList } from "@/components/grade-prediction/SubjectList";
import { MyBKConnection } from "@/components/grade-prediction/MyBKConnection";
import { ManualDataInput } from "@/components/grade-prediction/ManualDataInput";
import { calculateGPA, getTotalCredits, countGrades, processMonHocData } from "@/utils/gpaCalculations";

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
      if (Array.isArray(data)) {
        const processedData = processMonHocData(data);
        setMonHocList(processedData);
        toast({
          title: "Thành công",
          description: `Đã import ${processedData.length} môn học`,
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

  const gpa = calculateGPA(monHocList);
  const totalCredits = getTotalCredits(monHocList);
  const gradeDistribution = countGrades(monHocList);

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

          <MyBKConnection
            url={url}
            isLoading={isLoading}
            onUrlChange={setUrl}
            onOpenAndFetch={handleOpenAndFetchData}
          />

          <ManualDataInput onDataInput={handleManualDataInput} />

          {monHocList.length > 0 && (
            <>
              <GPAStats
                gpa10={gpa.gpa10}
                gpa4={gpa.gpa4}
                totalCredits={totalCredits}
                totalSubjects={monHocList.length}
              />

              <GradeDistribution gradeMap={gradeDistribution} />

              <SubjectList monHocList={monHocList} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GradePrediction;
