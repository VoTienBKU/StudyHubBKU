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
  uniqueid: string;
  id: number;
  khoiKienThucid: number;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  diemSo: number;
  diemChu: string;
  diemDat: string;
  xetTuChonTuDo: string | null;
  ghiChu: string;
  hieuLuc: string;
  monHocTuongDuongId: string | null;
  doUuTien: number;
}

interface MyBKData {
  DANHSACH_KHOIKIENTHUC: KhoiKienThuc[];
  DANHSACH_MONHOC_CTDT: MonHoc[];
}

interface GradePlan {
  [grade: string]: number;
}

const diemChuToHe4: Record<string, number> = {
  "A+": 4,
  "A": 4,
  "B+": 3.5,
  "B": 3,
  "C+": 2.5,
  "C": 2,
  "D+": 1.5,
  "D": 1,
  "F": 0
};

export const calculateGPA = (monHocList: MonHoc[]) => {
  if (monHocList.length === 0) return { gpa10: "0.00", gpa4: "0.00" };

  const validSubjects = monHocList.filter(mon =>
    mon.diemSo > 0 && mon.diemSo <= 10 && mon.soTinChi > 0 && mon.hieuLuc === "1"
  );

  if (validSubjects.length === 0) return { gpa10: "0.00", gpa4: "0.00" };

  const totalCredits = validSubjects.reduce((sum, mon) => sum + mon.soTinChi, 0);

  const totalPoints10 = validSubjects.reduce((sum, mon) => sum + mon.diemSo * mon.soTinChi, 0);
  const gpa10 = totalCredits > 0 ? (totalPoints10 / totalCredits).toFixed(2) : "0.00";

  const totalPoints4 = validSubjects.reduce((sum, mon) => {
    const diem4 = diemChuToHe4[mon.diemChu] ?? 0;
    return sum + diem4 * mon.soTinChi;
  }, 0);
  const gpa4 = totalCredits > 0 ? (totalPoints4 / totalCredits).toFixed(2) : "0.00";

  return { gpa10, gpa4 };
};

export const getTotalCredits = (monHocList: MonHoc[]) => {
  return monHocList
    .filter(mon => mon.hieuLuc === "1" && mon.soTinChi > 0)
    .reduce((sum, mon) => sum + mon.soTinChi, 0);
};

export function gradePlanForTarget(
  currentGPA: number,
  completedCredits: number,
  targetGPA: number,
  totalRequiredCredits: number
): GradePlan | null {
  const gradeValues: Record<string, number> = {
    C: 2.0,
    "C+": 2.5,
    B: 3.0,
    "B+": 3.5,
    A: 4.0,
  };

  const remainingCredits = totalRequiredCredits - completedCredits;
  if (remainingCredits <= 0) return null;

  // Bắt đầu: tất cả tín chỉ còn lại là C
  let plan: GradePlan = { A: 0, "B+": 0, B: 0, "C+": 0, C: remainingCredits };

  function calcGPA(p: GradePlan) {
    const totalScore =
      currentGPA * completedCredits +
      Object.entries(p).reduce(
        (sum, [grade, count]) => sum + gradeValues[grade] * count,
        0
      );
    const totalCredits = completedCredits + remainingCredits;
    return totalScore / totalCredits;
  }

  // Nếu đã đủ target chỉ với C thì trả luôn
  if (calcGPA(plan) >= targetGPA) return plan;

  // Nâng dần từ C -> C+ -> B -> B+ -> A
  const upgradeOrder = ["C", "C+", "B", "B+", "A"];
  for (let i = 0; i < upgradeOrder.length - 1; i++) {
    const from = upgradeOrder[i];
    const to = upgradeOrder[i + 1];

    while (plan[from] > 0) {
      plan[from]--;
      plan[to]++;

      if (calcGPA(plan) >= targetGPA) {
        return plan;
      }
    }
  }

  return null; // không thể đạt được target
}

export const countGrades = (monHocList: MonHoc[]) => {
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

export const processMyBKData = (data: MyBKData): MonHoc[] => {
  const monHocList = data.DANHSACH_MONHOC_CTDT || [];
  return Array.from(
    new Map(
      monHocList
        .filter((mon: MonHoc) => mon.diemSo <= 50 && mon.soTinChi >= 0) // Allow 0 tin chi for subjects like CCGDTC
        .sort((a: MonHoc, b: MonHoc) => b.diemSo - a.diemSo)
        .map((mon: MonHoc) => [mon.maMonHoc, mon])
    ).values()
  );
};

// For backward compatibility
export const processMonHocData = (data: any[]): MonHoc[] => {
  return Array.from(
    new Map(
      data
        .filter((mon: MonHoc) => mon.diemSo <= 50 && mon.soTinChi >= 0)
        .sort((a: MonHoc, b: MonHoc) => b.diemSo - a.diemSo)
        .map((mon: MonHoc) => [mon.maMonHoc, mon])
    ).values()
  );
};

// Knowledge blocks calculations
export const getTotalRequiredCredits = (khoiKienThucList: KhoiKienThuc[]): number => {
  return khoiKienThucList.reduce((sum, khoi) => sum + khoi.soTinChiYeuCau, 0);
};

export const getTotalAchievedCreditsFromKhoi = (khoiKienThucList: KhoiKienThuc[]): number => {
  return khoiKienThucList.reduce((sum, khoi) => sum + khoi.soTinChiDat, 0);
};

export const getCompletedKhoiCount = (khoiKienThucList: KhoiKienThuc[]): number => {
  return khoiKienThucList.filter(khoi => khoi.tinhTrangHoanThanh === "1").length;
};
