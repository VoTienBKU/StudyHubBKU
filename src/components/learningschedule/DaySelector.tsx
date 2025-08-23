// src/components/DaySelector.tsx
import React from "react";

type DayWithDate = { label: string; date: Date };

type Props = {
  days: DayWithDate[];
  activeIndex: number;
  onSelect: (i: number) => void;
  todayIndex: number;
};

export default function DaySelector({ days, activeIndex, onSelect, todayIndex }: Props) {
  return (
    <div className="grid grid-cols-7 gap-1 px-1 pb-2">
      {days.map((d, idx) => {
        const active = idx === activeIndex || (todayIndex === idx && activeIndex === todayIndex);
        return (
          <button
            key={d.label}
            onClick={() => onSelect(idx)}
            className={`px-1 py-2 rounded-md text-xs sm:text-sm border ${active ? "bg-education-primary text-white" : "bg-white"}`}
          >
            <div className="font-semibold">{d.label}</div>
            <div className="text-[11px] text-muted-foreground">{d.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
          </button>
        );
      })}
    </div>
  );
}
