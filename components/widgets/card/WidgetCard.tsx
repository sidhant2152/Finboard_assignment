"use client";

import type { FieldMapping, Widget } from "@/types/widget.types";
import { mapData } from "@/lib/mappers";

interface WidgetCardProps {
  widget: Widget;
  data: any;
}

const WidgetCard = ({ widget, data }: WidgetCardProps) => {
  const mapped = mapData(data, widget.fieldMapping as FieldMapping[]);

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      {mapped.map((item, index) => {
        return (
          <div
            key={item.sourcePath}
            className={`flex items-center justify-between gap-4 ${
              index !== mapped.length - 1
                ? "border-b border-border/50 pb-3"
                : ""
            }`}
          >
            <div className="text-sm font-medium text-muted-foreground shrink-0">
              {item.label}
            </div>
            <div className="text-base font-semibold shrink-0">
              {item.formattedValue}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WidgetCard;
