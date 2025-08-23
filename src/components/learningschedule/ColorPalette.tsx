// src/components/ColorPalette.tsx
import React from "react";

type Props = {
  colors: Record<string, string>;
  onChange: (code: string, color: string) => void;
};

export default function ColorPalette({ colors, onChange }: Props) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">Color palette</div>
      <div className="space-y-2">
        {Object.keys(colors).length === 0 && <div className="text-sm text-muted-foreground">Chưa có màu tuỳ chỉnh — chọn màu khi click vào lớp trên lưới</div>}
        {Object.entries(colors).map(([code, c]) => (
          <div key={code} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium" style={{ background: c }}>{code}</div>
            <div className="flex-1 text-sm">{code}</div>
            <input type="color" value={c} onChange={(e) => onChange(code, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}
