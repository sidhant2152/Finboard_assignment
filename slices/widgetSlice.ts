import { createSlice } from "@reduxjs/toolkit";
import type { Widget, WidgetConfig } from "@/types/widget.types";
import { setLocalStorageItem, WIDGET_CONFIG_KEY } from "@/lib/utils";

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
      setLocalStorageItem<WidgetConfig>(WIDGET_CONFIG_KEY, {
        totalWidgets: state.totalWidgets,
        widgets: state.widgets,
      });
    },
    removeWidget: (state, action) => {
      const id = action.payload;
      state.widgets = state.widgets.filter((widget) => widget.id != id);
      state.totalWidgets--;
      setLocalStorageItem<WidgetConfig>(WIDGET_CONFIG_KEY, {
        totalWidgets: state.totalWidgets,
        widgets: state.widgets,
      });
    },
    updateWidget: (state, action) => {
      const { id, updates } = action.payload;
      const widget = state.widgets.find((w) => w.id === id);
      if (widget) {
        Object.assign(widget, updates);
        setLocalStorageItem<WidgetConfig>(WIDGET_CONFIG_KEY, {
          totalWidgets: state.totalWidgets,
          widgets: state.widgets,
        });
      }
    },
    loadWidgets: (state, action) => {
      const { widgets, totalWidgets } = action.payload;
      state.widgets = widgets;
      state.totalWidgets = totalWidgets;
      setLocalStorageItem<WidgetConfig>(WIDGET_CONFIG_KEY, {
        totalWidgets: state.totalWidgets,
        widgets: state.widgets,
      });
    },
  },
});

export const { addWidget, removeWidget, updateWidget, loadWidgets } =
  widgetSlice.actions;
export default widgetSlice.reducer;
