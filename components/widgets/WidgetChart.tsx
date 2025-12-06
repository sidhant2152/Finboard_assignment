import React from "react";
import type { Widget, ChartFieldMapping } from "@/types/widget.types";
import { mapChartDataForLightweight } from "@/lib/mappers";
import ChartClient from "./ChartClient";

export default async function WidgetChart({ widget }: { widget: Widget }) {
  if (widget.type !== "chart") {
    return <div>Invalid widget</div>;
  }

  const response = await fetch(widget.apiConfig.url, {
    method: "GET",
    headers: widget.apiConfig.headers,
    cache: "no-store",
  });

  if (!response.ok) {
    return <div className="text-red-500">Failed to fetch API</div>;
  }

  const raw = await response.json();
  const mapped = mapChartDataForLightweight(
    raw,
    widget.fieldMapping as ChartFieldMapping
  );

  if (!mapped.series.length) {
    return <div>No data found</div>;
  }

  return <ChartClient mapped={mapped} />;
}
