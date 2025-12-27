import { flatten as flatFlatten } from "flat";
import type {
  FieldMapping,
  DataFormat,
  MappedColumn,
  MappedRow,
  MappedTableData,
  TableFieldMapping,
  ChartFieldMapping,
} from "@/types/widget.types";

export const flatten = (raw: any) => {
  return flatFlatten(raw, { safe: true }) as Record<string, any>;
};

export const formatValue = (format: DataFormat, rawValue: any): string => {
  if (rawValue == null) return "-";

  const num =
    typeof rawValue === "string" && !isNaN(Number(rawValue))
      ? Number(rawValue)
      : typeof rawValue === "number"
      ? rawValue
      : null;

  switch (format) {
    case "text":
      return String(rawValue);

    case "number":
      return num !== null
        ? new Intl.NumberFormat().format(num)
        : String(rawValue);

    case "percent":
      if (num === null) return String(rawValue);
      const pct = Math.abs(num) <= 1 ? num * 100 : num;
      return `${pct.toFixed(2)}%`;

    default:
      return String(rawValue);
  }
};

export const mapData = (rawApiData: any, fieldMapping: FieldMapping[]) => {
  const flattened = flatten(rawApiData);

  return fieldMapping.map((mapping) => {
    const rawValue = flattened[mapping.sourcePath];

    return {
      label: mapping.displayLabel,
      sourcePath: mapping.sourcePath,
      rawValue,
      formattedValue: formatValue(mapping.format, rawValue),
    };
  });
};

export const getAtPath = (obj: any, path: string): any => {
  if (!path) return obj;
  return path.split(".").reduce((acc, key) => {
    if (acc == null) return undefined;
    const idx = Number(key);
    return Array.isArray(acc) && !isNaN(idx) ? acc[idx] : acc[key];
  }, obj);
};

export const mapTableData = (
  rawApi: any,
  mapping: TableFieldMapping
): MappedTableData => {
  const arr = getAtPath(rawApi, mapping.arrayPath) ?? [];

  // Build columns
  const columns: MappedColumn[] = mapping.columns.map((c) => ({
    key: c.key ?? c.label.replace(/\s+/g, "_").toLowerCase(),
    label: c.label,
    format: c.format,
  }));

  // Build rows
  const rows: MappedRow[] = (Array.isArray(arr) ? arr : []).map(
    (row: any, idx: number) => {
      const flat = flatFlatten(row, { safe: true }) as Record<string, any>;
      const out: MappedRow = {
        id: `row-${idx}`, // fallback ID
      };

      // For each column add a property with same key
      for (const col of mapping.columns) {
        const key = col.key ?? col.label.replace(/\s+/g, "_").toLowerCase();

        let rawVal = getAtPath(row, col.sourcePath);
        if (rawVal === undefined) rawVal = flat[col.sourcePath];

        out[key] = rawVal == null ? "-" : String(rawVal);
      }

      return out;
    }
  );

  return {
    columns,
    rows,
    total: rows.length,
    lastUpdated: rawApi.last_updated ?? rawApi.lastUpdated,
  };
};

export const toNumber = (raw: any): number | null => {
  if (raw == null) return null;
  const cleaned = String(raw).replace(/,/g, "").replace(/%/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

export const mapChartDataForLightweight = (
  rawApi: any,
  mapping: ChartFieldMapping
) => {
  const rawObj = getAtPath(rawApi, mapping.arrayPath);

  if (!rawObj || typeof rawObj !== "object") {
    return { series: [], lastUpdated: undefined };
  }

  // Flatten rows
  const rows: FlatRow[] = Object.keys(rawObj).map((key) => {
    const flat = flatFlatten(rawObj[key] ?? {}, { safe: true }) as Record<
      string,
      any
    >;
    return { __key: key, ...flat };
  });

  // Sort by timestamp
  rows.sort((a, b) => (a.__key < b.__key ? -1 : 1));

  const timeValues = rows.map((r) => r.__key);

  // ----------------------
  // LINE CHART
  // ----------------------
  if (mapping.chartType === "line") {
    const series = mapping.yFields.map((field) => ({
      type: "line" as const,
      label: field.displayLabel,
      data: rows.map((row, i) => ({
        time: timeValues[i],
        value: toNumber(row[field.sourcePath]),
      })),
    }));

    return { series };
  }

  // ----------------------
  // CANDLE CHART
  // ----------------------
  if (mapping.chartType === "candlestick") {
    const find = (label: string) =>
      mapping.yFields.find((f) => f.displayLabel.toLowerCase().includes(label))
        ?.sourcePath;

    const open = find("open") ?? mapping.yFields[0]?.sourcePath;
    const high = find("high") ?? mapping.yFields[1]?.sourcePath;
    const low = find("low") ?? mapping.yFields[2]?.sourcePath;
    const close = find("close") ?? mapping.yFields[3]?.sourcePath;
    const vol = find("volume") ?? mapping.yFields[4]?.sourcePath;

    const candlePoints = rows.map((row, i) => ({
      time: timeValues[i],
      open: toNumber(row[open]),
      high: toNumber(row[high]),
      low: toNumber(row[low]),
      close: toNumber(row[close]),
      volume: vol ? toNumber(row[vol]) : undefined,
    }));

    return {
      series: [
        { type: "candlestick" as const, data: candlePoints },
        ...(vol
          ? [
              {
                type: "histogram" as const,
                data: candlePoints.map((c) => ({
                  time: c.time,
                  value: c.volume ?? 0,
                })),
              },
            ]
          : []),
      ],
    };
  }

  return { series: [] };
};
