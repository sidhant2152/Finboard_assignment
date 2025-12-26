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
  fieldMapping: FieldMapping[] | TableFieldMapping | ChartFieldMapping;
  apiConfig: ApiConfig;
}

export interface MappedColumn {
  key: string;
  label: string;
  format?: DataFormat;
}

export interface MappedRow {
  id: string;
  [key: string]: any;
}

export interface MappedTableData {
  columns: MappedColumn[];
  rows: MappedRow[];
  total: number;
  lastUpdated?: string;
}

export interface ColumnConfig {
  sourcePath: string;
  label: string; // "Ticker"
  format?: DataFormat;
  key?: string; // optional override
}

export interface TableFieldMapping {
  arrayPath: string; // e.g. "top_gainers"
  columns: ColumnConfig[];
}

export interface ChartYField {
  sourcePath: string; // Flattened key for Y value
  displayLabel: string; // Line label (shown in chart legend)
  format?: DataFormat; // "number" | "currency" | "percent" | "text"
}

export interface ChartFieldMapping {
  arrayPath: string; // Path to the array representing time-series
  xField: string; // Flattened key for X-axis (or "__key" to use timestamp)
  yFields: ChartYField[]; // One or multiple Y-axis fields
  chartType: "line" | "candlestick";
}
