import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ManualDataInputProps {
  onDataInput: (jsonData: string) => void;
}

export const ManualDataInput = ({ onDataInput }: ManualDataInputProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Import dữ liệu thủ công</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label htmlFor="manual-data">Paste dữ liệu JSON từ MyBK Console</Label>
          <textarea
            id="manual-data"
            className="w-full h-32 p-3 border rounded-md resize-none font-mono text-sm"
            placeholder='Paste kết quả từ lệnh copy({DANHSACH_KHOIKIENTHUC: window.DANHSACH_KHOIKIENTHUC, DANHSACH_MONHOC_CTDT: window.DANHSACH_MONHOC_CTDT}) tại đây...'
            onBlur={(e) => {
              if (e.target.value.trim()) {
                onDataInput(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
