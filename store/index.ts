import { configureStore } from "@reduxjs/toolkit";
import widgetReducer from "@/slices/widgetSlice";

export const store = configureStore({
  reducer: {
    widget: widgetReducer,
  },
});
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
