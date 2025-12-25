export type WidgetType = "card" | "table" | "chart";
export type DataFormat = "currency" | "percent" | "number" | "text";

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FieldMapping {
  sourcePath: string;
  displayLabel: string;
  format: DataFormat;
}

export interface ApiConfig {
  url: string;
  headers: Record<string, string>;
  refreshInterval: number;
}

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  lastUpdated?: Date;
  position: WidgetPosition;
  fieldMapping: FieldMapping[];
  apiConfig: ApiConfig;
}
