import React from "react";
import type { FieldMapping, Widget } from "@/types/widget.types";
import { mapData } from "@/lib/mappers";

interface WidgetCardProps {
  widget: Widget;
}

const WidgetCard = async ({ widget }: WidgetCardProps) => {
  const response = await fetch(widget.apiConfig.url, {
    method: "GET",
    headers: widget.apiConfig.headers,
  });

  const data = await response.json();
  const mapped = mapData(data, widget.fieldMapping as FieldMapping[]);

  return (
    <div>
      {mapped.map((item) => (
        <div key={item.sourcePath}>
          <strong>{item.label}: </strong>
          {item.formattedValue}
        </div>
      ))}
    </div>
  );
};

export default WidgetCard;
