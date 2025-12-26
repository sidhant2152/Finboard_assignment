import React from "react";
import type { Widget, TableFieldMapping } from "@/types/widget.types";
import { mapTableData } from "@/lib/mappers";
import TableClient from "./TableClient";

interface WidgetTableProps {
  widget: Widget;
}

const WidgetTable = async ({ widget }: WidgetTableProps) => {
  if (widget.type !== "table" || !("arrayPath" in widget.fieldMapping)) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-destructive">
          Invalid table widget configuration
        </p>
      </div>
    );
  }

  const response = await fetch(widget.apiConfig.url, {
    method: "GET",
    headers: widget.apiConfig.headers,
  });

  if (!response.ok) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-destructive">
          Failed to fetch data: {response.statusText}
        </p>
      </div>
    );
  }

  const data = await response.json();
  const mappedData = mapTableData(
    data,
    widget.fieldMapping as TableFieldMapping
  );

  return <TableClient data={mappedData} />;
};

export default WidgetTable;
