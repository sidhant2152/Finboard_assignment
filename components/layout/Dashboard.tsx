"use client";
import { useEffect, useCallback } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import type { Widget } from "@/types/widget.types";
import { WidgetWrapper } from "../widgets/WidgetWrapper";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { loadWidgets, updateWidget } from "@/slices/widgetSlice";

const COLS = 12;
const ROW_HEIGHT = 80;

export function DashboardGrid() {
  const dispatch = useAppDispatch();
  const { widgets } = useAppSelector((state) => state.widget);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("widget-config");
      if (stored) {
        const config = JSON.parse(stored);
        dispatch(
          loadWidgets({
            widgets: config.widgets || [],
            totalWidgets: config.totalWidgets || 0,
          })
        );
      }
    } catch (error) {
      console.error("Failed to load widgets from localStorage:", error);
    }
  }, [dispatch]);

  const layout = widgets.map((widget) => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.width,
    h: widget.position.height,
    minW: 2,
    minH: 2,
  }));

  const handleLayoutChange = (newLayout: GridLayout.Layout[]) => {
    newLayout.forEach((item) => {
      const widget = widgets.find((w) => w.id === item.i);
      if (
        widget &&
        (widget.position.x !== item.x ||
          widget.position.y !== item.y ||
          widget.position.width !== item.w ||
          widget.position.height !== item.h)
      ) {
        dispatch(
          updateWidget({
            id: item.i,
            updates: {
              position: {
                x: item.x,
                y: item.y,
                width: item.w,
                height: item.h,
              },
            },
          })
        );
      }
    });
  };

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
      width={1800}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".drag-handle"
      isResizable={true}
      isDraggable={true}
      compactType="vertical"
      preventCollision={false}
      margin={[16, 16]}
    >
      {widgets.map((widget: Widget) => (
        <div key={widget.id} className="widget-grid-item">
          <WidgetWrapper widget={widget} />
        </div>
      ))}
    </GridLayout>
  );
}
