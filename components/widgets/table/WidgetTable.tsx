"use client";

import type { Widget, TableFieldMapping } from "@/types/widget.types";
import { mapTableData } from "@/lib/mappers";
import TableClient from "./TableClient";

interface WidgetTableProps {
  widget: Widget;
  data: any;
}

const WidgetTable = ({ widget, data }: WidgetTableProps) => {
  if (widget.type !== "table" || !("arrayPath" in widget.fieldMapping)) {
    return null;
  }

  const mappedData = mapTableData(
    data,
    widget.fieldMapping as TableFieldMapping
  );

  return <TableClient data={mappedData} />;
};

export default WidgetTable;
