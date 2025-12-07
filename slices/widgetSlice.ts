import { createSlice } from "@reduxjs/toolkit";
import type { Widget } from "@/types/widget.types";

interface WidgetSliceType {
  totalWidgets: number;
  widgets: Widget[];
}

const initialState: WidgetSliceType = {
  totalWidgets: 0,
  widgets: [],
};

const widgetSlice = createSlice({
  name: "widget",
  initialState,
  reducers: {
    addWidget: (state, action) => {
      const widget = action.payload;
      state.widgets.push(widget);
      state.totalWidgets++;
      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "widget-config",
          JSON.stringify({
            totalWidgets: state.totalWidgets,
            widgets: state.widgets,
          })
        );
      }
    },
    removeWidget: (state, action) => {
      const id = action.payload;
      state.widgets = state.widgets.filter((widget) => widget.id != id);
      state.totalWidgets--;
      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "widget-config",
          JSON.stringify({
            totalWidgets: state.totalWidgets,
            widgets: state.widgets,
          })
        );
      }
    },
    updateWidget: (state, action) => {
      const { id, updates } = action.payload;
      const widget = state.widgets.find((w) => w.id === id);
      if (widget) {
        Object.assign(widget, updates);
        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "widget-config",
            JSON.stringify({
              totalWidgets: state.totalWidgets,
              widgets: state.widgets,
            })
          );
        }
      }
    },
    loadWidgets: (state, action) => {
      const { widgets, totalWidgets } = action.payload;
      state.widgets = widgets;
      state.totalWidgets = totalWidgets;
      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "widget-config",
          JSON.stringify({
            totalWidgets: state.totalWidgets,
            widgets: state.widgets,
          })
        );
      }
    },
  },
});

export const { addWidget, removeWidget, updateWidget, loadWidgets } =
  widgetSlice.actions;
export default widgetSlice.reducer;
