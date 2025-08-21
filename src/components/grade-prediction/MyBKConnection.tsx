import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";

interface MyBKConnectionProps {
  url: string;
  isLoading: boolean;
  onUrlChange: (url: string) => void;
  onOpenAndFetch: () => void;
}

export const MyBKConnection = ({ url, isLoading, onUrlChange, onOpenAndFetch }: MyBKConnectionProps) => {
  return (
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
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://mybk.hcmut.edu.vn/..."
            className="mt-1"
          />
        </div>
        <Button
          onClick={onOpenAndFetch}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Mở MyBK</span>
        </Button>

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
  );
};
