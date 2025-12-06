"use client";
import { useCallback } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import type { Widget } from "@/types/widget.types";
import { PropsWithChildren } from "react";

const COLS = 12;
const ROW_HEIGHT = 80;

const widgets: Widget[] = [
  {
    id: "1",
    title: "Widget 1",
    type: "card",
    lastUpdated: new Date(),
    position: { x: 0, y: 0, width: 4, height: 4 },
    fieldMapping: [
      {
        sourcePath: "Realtime Currency Exchange Rate.5. Exchange Rate",
        displayLabel: "Exchange Rate",
        format: "number",
      },
      {
        sourcePath: "Realtime Currency Exchange Rate.6. Last Refreshed",
        displayLabel: "Updated At",
        format: "text",
      },
    ],
    apiConfig: {
      url: "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo",
      headers: {},
      refreshInterval: 0,
    },
  },
  {
    id: "widget-gainers-1",
    title: "Top Gainers",
    type: "table",
    lastUpdated: new Date(),
    position: { x: 0, y: 0, width: 6, height: 8 },

    // card-specific fieldMapping (not used in tables but required by your type)

    apiConfig: {
      url: "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo",
      headers: {},
      refreshInterval: 30000,
    },

    fieldMapping: {
      arrayPath: "top_gainers",
      columns: [
        {
          sourcePath: "ticker",
          label: "Ticker",
          format: "text",
        },
        {
          sourcePath: "price",
          label: "Price",
          format: "number",
        },
        {
          sourcePath: "change_percentage",
          label: "Change %",
          format: "percent",
        },
        {
          sourcePath: "volume",
          label: "Volume",
          format: "number",
        },
      ],
    },
  },
  {
    id: "widget_line_1",
    title: "IBM – Close vs High (Line Chart)",
    type: "chart",
    lastUpdated: new Date(),
    position: { x: 0, y: 8, width: 6, height: 6 },

    fieldMapping: {
      arrayPath: "Time Series (5min)", // parent that contains timestamp → OHLCV
      xField: "__key", // timestamp key is our X axis
      chartType: "line",

      // Two lines: Close + High
      yFields: [
        {
          sourcePath: "4. close",
          displayLabel: "Close Price",
          format: "number",
        },
        {
          sourcePath: "2. high",
          displayLabel: "High Price",
          format: "number",
        },
      ],
    },

    apiConfig: {
      url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo",
      headers: {},
      refreshInterval: 300000, // 5 min
    },
  },
  {
    id: "widget_candle_1",
    title: "IBM – Intraday Candlestick",
    type: "chart",
    lastUpdated: new Date(),
    position: { x: 6, y: 8, width: 6, height: 6 },

    fieldMapping: {
      arrayPath: "Time Series (5min)", // same parent object
      xField: "__key", // timeline is the timestamp

      chartType: "candlestick",

      yFields: [
        { sourcePath: "1. open", displayLabel: "Open", format: "number" },
        { sourcePath: "2. high", displayLabel: "High", format: "number" },
        { sourcePath: "3. low", displayLabel: "Low", format: "number" },
        { sourcePath: "4. close", displayLabel: "Close", format: "number" },
        { sourcePath: "5. volume", displayLabel: "Volume", format: "number" },
      ],
    },

    apiConfig: {
      url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo",
      headers: {},
      refreshInterval: 300000,
    },
  },
];

export function DashboardGrid({ children }: PropsWithChildren) {
  const layout = widgets.map((widget) => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.width,
    h: widget.position.height,
    minW: 2,
    minH: 2,
  }));

  // const handleLayoutChange = useCallback(
  //   (newLayout: GridLayout.Layout[]) => {
  //     newLayout.forEach((item) => {
  //       const widget = widgets.find((w) => w.id === item.i);
  //       if (
  //         widget &&
  //         (widget.position.x !== item.x ||
  //           widget.position.y !== item.y ||
  //           widget.position.width !== item.w ||
  //           widget.position.height !== item.h)
  //       ) {
  //       //   updateWidgetPosition(item.i, {
  //       //     x: item.x,
  //       //     y: item.y,
  //       //     w: item.w,
  //       //     h: item.h,
  //       //   });
  //       }
  //     });
  //   },
  //   [widgets, updateWidgetPosition]
  // );

  if (widgets.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No widgets yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Add Widget" to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={COLS}
      rowHeight={ROW_HEIGHT}
      width={1200}
      onLayoutChange={() => {}}
      draggableHandle=".drag-handle"
      isResizable={true}
      isDraggable={true}
      compactType="vertical"
      preventCollision={false}
      margin={[16, 16]}
    >
      {children}
    </GridLayout>
  );
}
