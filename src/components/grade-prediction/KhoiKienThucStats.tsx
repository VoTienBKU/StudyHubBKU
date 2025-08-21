import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, Target, CheckCircle, XCircle } from "lucide-react";

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

interface KhoiKienThucStatsProps {
  khoiKienThucList: KhoiKienThuc[];
}

export const KhoiKienThucStats = ({ khoiKienThucList }: KhoiKienThucStatsProps) => {
  if (khoiKienThucList.length === 0) return null;

  const totalRequiredCredits = khoiKienThucList.reduce((sum, khoi) => sum + khoi.soTinChiYeuCau, 0);
  const totalAchievedCredits = khoiKienThucList.reduce((sum, khoi) => sum + khoi.soTinChiDat, 0);
  const completedBlocks = khoiKienThucList.filter(khoi => khoi.tinhTrangHoanThanh === "1").length;
  return (<></>)
  return (
    <div className="space-y-6 mb-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-6 text-center">
            <Target className="h-8 sm:h-12 w-8 sm:w-12 text-primary mx-auto mb-2" />
            <h3 className="text-lg sm:text-2xl font-bold text-foreground">
              {totalAchievedCredits}/{totalRequiredCredits}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Tổng số tín chỉ</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6 text-center">
            <BookOpenCheck className="h-8 sm:h-12 w-8 sm:w-12 text-education-secondary mx-auto mb-2" />
            <h3 className="text-lg sm:text-2xl font-bold text-foreground">
              {completedBlocks}/{khoiKienThucList.length}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Khối hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6 text-center">
            <Target className="h-8 sm:h-12 w-8 sm:w-12 text-accent mx-auto mb-2" />
            <h3 className="text-lg sm:text-2xl font-bold text-foreground">
              {totalRequiredCredits > 0 ? Math.round((totalAchievedCredits / totalRequiredCredits) * 100) : 0}%
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Tiến độ hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Blocks Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpenCheck className="h-5 w-5 text-primary" />
            <span>Chi tiết khối kiến thức</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {khoiKienThucList
              .sort((a, b) => a.soThuTu - b.soThuTu)
              .map((khoi) => {
                const isCompleted = khoi.tinhTrangHoanThanh === "1";
                const isMandatory = khoi.batBuoc === "1";
                const progressPercent = khoi.soTinChiYeuCau > 0
                  ? Math.round((khoi.soTinChiDat / khoi.soTinChiYeuCau) * 100)
                  : 0;

                return (
                  <div
                    key={khoi.uniqueid}
                    className={`p-3 rounded-lg border-2 flex items-center justify-between gap-4 ${isCompleted
                      ? "border-education-secondary/30 bg-education-secondary/5"
                      : "border-orange-200 bg-orange-50"
                      }`}
                  >
                    {/* Tên + icon */}
                    <div className="flex items-center gap-2 min-w-[200px]">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-education-secondary" />
                      ) : (
                        <XCircle className="h-5 w-5 text-orange-500" />
                      )}
                      <span className="font-semibold">{khoi.tenKhoiKienThuc}</span>
                      {isMandatory && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                          Bắt buộc
                        </span>
                      )}
                    </div>

                    {/* Thông tin */}
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tín chỉ: </span>
                        <span className="font-medium">
                          {khoi.soTinChiDat}/{khoi.soTinChiYeuCau}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Môn học: </span>
                        <span className="font-medium">
                          {khoi.soMonHocDat}/{khoi.soMonHocYeuCau || "Không yêu cầu"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tiến độ: </span>
                        <span className={`font-medium ${isCompleted ? "text-education-secondary" : "text-orange-600"}`}>
                          {progressPercent}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Trạng thái: </span>
                        <span className={`font-medium ${isCompleted ? "text-education-secondary" : "text-orange-600"}`}>
                          {isCompleted ? "Hoàn thành" : "Chưa đạt"}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar nhỏ */}
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${isCompleted ? "bg-education-secondary" : "bg-orange-400"
                            }`}
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
