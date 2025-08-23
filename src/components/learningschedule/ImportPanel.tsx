// src/components/ImportPanel.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash } from "lucide-react";

type Props = {
  rawText: string;
  setRawText: (s: string) => void;
  onImport: () => void;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onClear: () => void;
  isMobile: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
};

export default function ImportPanel({
  rawText,
  setRawText,
  onImport,
  onFile,
  onExport,
  onClear,
  isMobile,
  fileRef,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm">Nhập JSON</CardTitle>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onExport} aria-label="Export">
            <Download size={16} />
          </Button>
          <Button size="sm" variant="destructive" onClick={onClear} aria-label="Clear">
            <Trash size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <label className="block text-sm font-medium mb-1">Dán JSON</label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={isMobile ? 3 : 8}
          className="w-full p-2 sm:p-3 border rounded-md font-mono text-xs sm:text-sm resize-none"
          placeholder="Dán payload JSON ở đây (ví dụ: API trả về 'data' array)"
        />

        <div className="mt-3 flex gap-2 flex-wrap">
          <Button onClick={onImport} size="sm">Nhập & Lưu</Button>

          <label className="inline-flex items-center px-3 py-2 bg-white border rounded-md cursor-pointer text-sm">
            <Upload size={16} className="mr-2" />
            Nhập bằng file
            <input ref={fileRef} type="file" accept="application/json" onChange={onFile} className="hidden" />
          </label>

          <Button onClick={onExport} size="sm" variant="outline">Xuất file</Button>
        </div>
      </CardContent>
    </Card>
  );
}
