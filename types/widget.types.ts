export type WidgetType = "card" | "table" | "chart";
export type DataFormat = "currency" | "percent" | "number" | "text";
export type ChartType = "line" | "candlestick";

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  position: WidgetPosition;
  fieldMapping: FieldMapping[] | TableFieldMapping | ChartFieldMapping;
  apiConfig: ApiConfig;
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ApiConfig {
  url: string;
  headers: Record<string, string>;
  refreshInterval: number;
}

export interface FieldMapping {
  sourcePath: string;
  displayLabel: string;
  format: DataFormat;
}

export interface MappedColumn {
  key: string;
  label: string;
  format: DataFormat;
}

export interface MappedRow {
  id: string;
  [key: string]: any;
}

export interface MappedTableData {
  columns: MappedColumn[];
  rows: MappedRow[];
  total: number;
}

export interface TableFieldMapping {
  arrayPath: string;
  columns: FieldMapping[];
}

export interface WidgetConfig {
  totalWidgets: number;
  widgets: any[];
}

export interface ChartFieldMapping {
  xFieldPath: string; // Path for x axis
  yFields: FieldMapping[];
  chartType: ChartType;
}

export interface FlattenedField {
  path: string;
  value: any;
  type: "string" | "number" | "boolean" | "object" | "array";
  isArray: boolean;
}
