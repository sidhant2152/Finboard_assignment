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
    position: { x: 0, y: 0, width: 100, height: 100 },
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
