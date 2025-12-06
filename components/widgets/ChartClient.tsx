"use client";

import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineSeries,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
} from "lightweight-charts";

type LineSeriesType = {
  type: "line";
  label: string;
  data: { time: string | number; value: number | null }[];
};

type CandleSeriesType = {
  type: "candlestick";
  data: {
    time: string | number;
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
  }[];
};

type HistogramSeriesType = {
  type: "histogram";
  data: { time: string | number; value: number | null }[];
};

type MappedSeries = LineSeriesType | CandleSeriesType | HistogramSeriesType;

// Convert time string to Unix timestamp
function timeToUnix(time: string | number): number {
  if (typeof time === "number") return time;
  const date = new Date(time);
  return Math.floor(date.getTime() / 1000);
}

// Get computed CSS variable value as RGB/hex color
function getCSSVariableColor(variable: string, element: HTMLElement): string {
  // Create a temporary element to get computed color
  const temp = document.createElement("div");
  temp.style.color = `var(${variable})`;
  temp.style.position = "absolute";
  temp.style.visibility = "hidden";
  temp.style.pointerEvents = "none";
  document.body.appendChild(temp);

  const computed = getComputedStyle(temp);
  let colorValue = computed.color;
  document.body.removeChild(temp);

  // If the color is already in RGB/RGBA format, return it
  if (
    colorValue &&
    (colorValue.startsWith("rgb") || colorValue.startsWith("#"))
  ) {
    return colorValue;
  }

  // If we got a color in another format (lab, oklch, etc.), convert it using canvas
  if (
    colorValue &&
    colorValue !== "rgba(0, 0, 0, 0)" &&
    colorValue !== "transparent"
  ) {
    try {
      // Use canvas to convert any color format to RGB
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = colorValue;
        ctx.fillRect(0, 0, 1, 1);
        const imageData = ctx.getImageData(0, 0, 1, 1);
        const [r, g, b] = imageData.data;
        return `rgb(${r}, ${g}, ${b})`;
      }
    } catch (e) {
      // If conversion fails, fall through to default
    }
  }

  // Fallback to a default color
  return "#ffffff";
}

export default function ChartClient({
  mapped,
  height = 320,
}: {
  mapped: { series: MappedSeries[]; lastUpdated?: string };
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRefs = useRef<ISeriesApi<"Line" | "Candlestick" | "Histogram">[]>(
    []
  );

  const palette = [
    "#3B82F6",
    "#F97316",
    "#10B981",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#F59E0B",
    "#84CC16",
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Cleanup previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRefs.current = [];
    }

    // Get computed CSS variable colors
    const textColor = getCSSVariableColor("--foreground", container);

    // Create chart following the documented pattern
    const chart = createChart(container, {
      width: container.clientWidth,
      height,
      layout: {
        textColor: textColor,
        background: { type: ColorType.Solid, color: "transparent" },
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: true },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false,
        rightOffset: 12,
        barSpacing: 3,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
    });

    // Hide TradingView logo using CSS
    const logoElement = container.querySelector('a[href*="tradingview"]');
    if (logoElement) {
      (logoElement as HTMLElement).style.display = "none";
    }

    // Also hide any watermark/attribution elements
    const observer = new MutationObserver(() => {
      const logos = container.querySelectorAll(
        'a[href*="tradingview"], [class*="watermark"], [class*="attribution"]'
      );
      logos.forEach((logo) => {
        (logo as HTMLElement).style.display = "none";
      });
    });

    observer.observe(container, { childList: true, subtree: true });

    chartRef.current = chart;
    seriesRefs.current = [];

    // Add series following the documented pattern: chart.addSeries(SeriesConstructor, options)
    mapped.series.forEach((s, idx) => {
      try {
        if (s.type === "line") {
          const lineSeries = chart.addSeries(LineSeries, {
            color: palette[idx % palette.length],
            lineWidth: 2,
            title: s.label,
          });

          const data = (s as LineSeriesType).data
            .filter((d) => d.value !== null && d.value !== undefined)
            .map((d) => ({
              time: timeToUnix(d.time) as any,
              value: d.value!,
            }));

          lineSeries.setData(data);
          seriesRefs.current.push(lineSeries);
        } else if (s.type === "candlestick") {
          const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: true,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
          });

          // Store original data with volume for tooltip
          const dataWithVolume = (s as CandleSeriesType).data
            .filter(
              (d) =>
                d.open !== null &&
                d.high !== null &&
                d.low !== null &&
                d.close !== null
            )
            .map((d) => ({
              time: timeToUnix(d.time) as any,
              open: d.open!,
              high: d.high!,
              low: d.low!,
              close: d.close!,
            }));

          candlestickSeries.setData(dataWithVolume);
          seriesRefs.current.push(candlestickSeries);

          // Get volume data if histogram series exists
          const volumeSeries = mapped.series.find(
            (series) => series.type === "histogram"
          ) as HistogramSeriesType | undefined;

          // Add custom tooltip for candlestick
          chart.subscribeCrosshairMove((param) => {
            // Remove existing tooltip first
            const existingTooltip = container.querySelector(".chart-tooltip");
            if (existingTooltip) {
              existingTooltip.remove();
            }

            if (
              param.point === undefined ||
              !param.time ||
              param.seriesData.size === 0
            ) {
              return;
            }

            const candlestickData = param.seriesData.get(
              candlestickSeries
            ) as any;
            if (!candlestickData) return;

            const time = param.time as number;
            const volumeData = volumeSeries?.data.find(
              (d) => timeToUnix(d.time) === time
            );

            // Create custom tooltip
            const tooltip = document.createElement("div");
            tooltip.className = "chart-tooltip";
            tooltip.style.cssText = `
              position: absolute;
              background: rgba(0, 0, 0, 0.9);
              color: white;
              padding: 8px 12px;
              border-radius: 4px;
              font-size: 12px;
              font-family: system-ui, -apple-system, sans-serif;
              pointer-events: none;
              z-index: 1000;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            `;

            const timeStr = new Date(time * 1000).toLocaleString();
            const open = candlestickData.open?.toFixed(2) || "N/A";
            const high = candlestickData.high?.toFixed(2) || "N/A";
            const low = candlestickData.low?.toFixed(2) || "N/A";
            const close = candlestickData.close?.toFixed(2) || "N/A";
            const volume = volumeData?.value?.toLocaleString() || "N/A";

            tooltip.innerHTML = `
              <div style="font-weight: 600; margin-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">
                ${timeStr}
              </div>
              <div style="display: grid; grid-template-columns: 80px 1fr; gap: 4px 12px;">
                <span style="opacity: 0.7;">Open:</span>
                <span style="font-weight: 500;">${open}</span>
                <span style="opacity: 0.7;">High:</span>
                <span style="font-weight: 500; color: #26a69a;">${high}</span>
                <span style="opacity: 0.7;">Low:</span>
                <span style="font-weight: 500; color: #ef5350;">${low}</span>
                <span style="opacity: 0.7;">Close:</span>
                <span style="font-weight: 500;">${close}</span>
                ${
                  volume !== "N/A"
                    ? `<span style="opacity: 0.7;">Volume:</span><span style="font-weight: 500;">${volume}</span>`
                    : ""
                }
              </div>
            `;

            // Position tooltip near cursor
            if (param.point) {
              const rect = container.getBoundingClientRect();
              const x = param.point.x;
              const y = param.point.y;

              tooltip.style.left = `${Math.min(x + 10, rect.width - 200)}px`;
              tooltip.style.top = `${Math.max(y - 10, 10)}px`;

              container.appendChild(tooltip);
            }
          });
        } else if (s.type === "histogram") {
          const histogramSeries = chart.addSeries(HistogramSeries, {
            color: palette[idx % palette.length] + "88",
            priceFormat: { type: "volume" },
            priceScaleId: "volume",
          });

          const data = (s as HistogramSeriesType).data
            .filter((d) => d.value !== null && d.value !== undefined)
            .map((d) => ({
              time: timeToUnix(d.time) as any,
              value: d.value!,
            }));

          histogramSeries.setData(data);
          seriesRefs.current.push(histogramSeries);
        }
      } catch (err) {
        console.error("Error adding series:", err);
      }
    });

    // Automatically calculate the visible range to fit all data from all series
    chart.timeScale().fitContent();

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      observer.disconnect();
      // Remove any tooltips
      const tooltips = container.querySelectorAll(".chart-tooltip");
      tooltips.forEach((tooltip) => tooltip.remove());
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      seriesRefs.current = [];
    };
  }, [mapped, height]);

  return (
    <div className="h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full"
        style={{ minHeight: `${height}px` }}
      />
    </div>
  );
}
