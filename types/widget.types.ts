export type WidgetType = "card" | "table" | "chart";
export type DataFormat = "currency" | "percent" | "number" | "text";

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
  label: string;
  format?: DataFormat;
  key?: string;
}

export interface TableFieldMapping {
  arrayPath: string;
  columns: ColumnConfig[];
}

export interface ChartYField {
  sourcePath: string; // Flattened key for Y axis
  displayLabel: string;
  format?: DataFormat;
}

export interface ChartFieldMapping {
  arrayPath: string; // Path for x axis
  yFields: ChartYField[];
  chartType: "line" | "candlestick";
}

export interface FlattenedField {
  path: string;
  value: any;
  type: "string" | "number" | "boolean" | "object" | "array";
  isArray: boolean;
}
