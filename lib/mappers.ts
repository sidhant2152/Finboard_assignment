import { flatten as flatFlatten } from "flat";
import type { FieldMapping, DataFormat } from "@/types/widget.types";

function flatten(raw: any) {
  return flatFlatten(raw, { safe: true }) as Record<string, any>;
}

function formatValue(format: DataFormat, rawValue: any): string {
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
}

export function mapData(rawApiData: any, fieldMapping: FieldMapping[]) {
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
}
