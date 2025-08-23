// src/components/EventModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { NormalizedEvent } from "@/utils/learningSchedule";

type Props = {
  event: NormalizedEvent;
  color: string;
  setColor: (c: string) => void;
  paletteForCode: (code: string) => string[];
  onSave: () => void;
  onClose: () => void;
  draggingColor: boolean;
  setDraggingColor: (b: boolean) => void;
};

export default function EventModal({ event, color, setColor, paletteForCode, onSave, onClose, draggingColor, setDraggingColor }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-60 w-full max-w-full sm:max-w-2xl p-2 sm:p-4">
        <div className="bg-white rounded-md shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">{event.code} <br />{event.title}</div>
              <div className="text-sm text-muted-foreground">{event.startTime ?? "-"} — {event.endTime ?? "-"} · {event.room}</div>
              <div className="text-sm">Giảng viên: {event.teacher || "Chưa biết"}</div>
              <div className="text-xs text-muted-foreground mt-2">Weeks: {(event.raw?.weekSeriesDisplay) || "—"}</div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-sm">Màu hiện tại</div>
              <div className="w-12 h-12 rounded-md border" style={{ background: color }} />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Chọn màu</label>
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
              <div className="text-sm text-muted-foreground">Hoặc kéo chọn từ bảng màu:</div>
            </div>

            <div className="mt-3 grid grid-cols-10 gap-2 select-none" onMouseUp={() => setDraggingColor(false)}>
              {paletteForCode(event.code).map((c) => (
                <div
                  key={c}
                  className="h-8 rounded-md border cursor-pointer"
                  style={{ background: c }}
                  onMouseDown={() => { setDraggingColor(true); setColor(c); }}
                  onMouseEnter={() => { if (draggingColor) setColor(c); }}
                  onMouseUp={() => { if (draggingColor) setDraggingColor(false); }}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
            <Button size="sm" onClick={onSave}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
