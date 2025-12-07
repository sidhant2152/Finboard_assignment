"use client";

import type { Widget, ChartFieldMapping } from "@/types/widget.types";
import { mapChartDataForLightweight } from "@/lib/mappers";
import ChartClient from "./ChartClient";

interface WidgetChartProps {
  widget: Widget;
  data: any;
}

export default function WidgetChart({ widget, data }: WidgetChartProps) {
  const mapped = mapChartDataForLightweight(
    data,
    widget.fieldMapping as ChartFieldMapping
  );

  if (!mapped.series.length) {
    return null;
  }

  return <ChartClient mapped={mapped} />;
}
