"use client";

import { useMemo } from "react";
import { flatten } from "@/lib/mappers";
import { Plus, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  WidgetType,
  FieldMapping,
  DataFormat,
  FlattenedField,
} from "@/types/widget.types";
import { getAtPath } from "@/lib/mappers";

interface FieldSelectorProps {
  apiResponse: any;
  widgetType: WidgetType;
  arrayPath: string;
  chartArrayPath: string;
  selectedFields: FieldMapping[];
  selectedColumns: Array<{
    sourcePath: string;
    label: string;
    format: DataFormat;
  }>;
  selectedYFields: Array<{
    sourcePath: string;
    displayLabel: string;
    format?: DataFormat;
  }>;
  onAddField: (field: FlattenedField) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FieldSelector({
  apiResponse,
  widgetType,
  arrayPath,
  chartArrayPath,
  selectedFields,
  selectedColumns,
  selectedYFields,
  onAddField,
  searchQuery,
  onSearchChange,
}: FieldSelectorProps) {
  const availableFields = useMemo(() => {
    if (!apiResponse) return [];

    if (widgetType === "card") {
      const flattened = flatten(apiResponse);
      return Object.entries(flattened)
        .filter(([_, value]) => {
          return (
            value !== null && typeof value !== "object" && !Array.isArray(value)
          );
        })
        .map(([path, value]) => ({
          path,
          value,
          type: typeof value as "string" | "number" | "boolean",
          isArray: false,
        }));
    }

    // TABLE
    // First we will only show arrays that user can select
    if (widgetType === "table" && !arrayPath) {
      const flattened = flatten(apiResponse);
      return Object.entries(flattened)
        .filter(([_, value]) => Array.isArray(value))
        .map(([path, value]) => ({
          path,
          value,
          type: "array" as const,
          isArray: true,
        }));
    }

    // TABLE
    // Once user select array for table
    // then we will show all the fields inside the array to display as column
    if (widgetType === "table" && arrayPath) {
      const arrayData = getAtPath(apiResponse, arrayPath);
      if (!Array.isArray(arrayData) || arrayData.length === 0) return [];

      const firstItem = arrayData[0];
      const flattened = flatten(firstItem);
      return Object.entries(flattened)
        .filter(([_, value]) => {
          return (
            value !== null && typeof value !== "object" && !Array.isArray(value)
          );
        })
        .map(([path, value]) => ({
          path,
          value,
          type: typeof value as "string" | "number" | "boolean",
          isArray: false,
        }));
    }

    // CHART
    // First we will only show object that user can select for X axis
    if (widgetType === "chart" && !chartArrayPath) {
      if (
        !apiResponse ||
        typeof apiResponse !== "object" ||
        Array.isArray(apiResponse)
      ) {
        return [];
      }

      return Object.entries(apiResponse)
        .filter(([_, value]) => {
          return (
            value !== null && typeof value === "object" && !Array.isArray(value)
          );
        })
        .map(([path, value]) => ({
          path,
          value,
          type: "object" as const,
          isArray: false,
        }));
    }

    // CHART
    // Once user has selected object
    // then we will give option to select other fields for Y axis
    if (widgetType === "chart" && chartArrayPath) {
      const chartData = getAtPath(apiResponse, chartArrayPath);
      if (
        !chartData ||
        typeof chartData !== "object" ||
        Array.isArray(chartData)
      )
        return [];

      const firstKey = Object.keys(chartData)[0];
      if (!firstKey) return [];

      const firstEntry = chartData[firstKey];
      const flattened = flatten(firstEntry);
      return Object.entries(flattened)
        .filter(([_, value]) => {
          return (
            value !== null && typeof value !== "object" && !Array.isArray(value)
          );
        })
        .map(([path, value]) => ({
          path,
          value,
          type: typeof value as "string" | "number" | "boolean",
          isArray: false,
        }));
    }

    return [];
  }, [apiResponse, widgetType, arrayPath, chartArrayPath]);

  const filteredFields = useMemo(() => {
    if (!searchQuery) return availableFields;

    const query = searchQuery.toLowerCase();
    return availableFields.filter(
      (field) =>
        field.path.toLowerCase().includes(query) ||
        String(field.value).toLowerCase().includes(query)
    );
  }, [availableFields, searchQuery]);

  const selectedPaths = useMemo(() => {
    const paths = new Set<string>();

    if (widgetType === "card") {
      selectedFields.forEach((f) => paths.add(f.sourcePath));
    } else if (widgetType === "table") {
      if (arrayPath) paths.add(arrayPath);
      selectedColumns.forEach((c) => paths.add(c.sourcePath));
    } else if (widgetType === "chart") {
      if (chartArrayPath) paths.add(chartArrayPath);
      selectedYFields.forEach((f) => paths.add(f.sourcePath));
    }

    return paths;
  }, [
    widgetType,
    selectedFields,
    arrayPath,
    selectedColumns,
    chartArrayPath,
    selectedYFields,
  ]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search-fields">Search Fields</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            id="search-fields"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for fields..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Available Fields */}
      <div>
        <h3 className="text-sm font-medium mb-2">
          {widgetType === "card"
            ? "Available Fields"
            : widgetType === "table"
            ? arrayPath
              ? "Select Columns (from first array item)"
              : "Select Array Path"
            : chartArrayPath
            ? "Select Y-Axis Fields (from first entry)"
            : "Select Object Path"}
        </h3>
        <div className="border rounded-md max-h-60 overflow-y-auto">
          {filteredFields.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {widgetType === "table" && !arrayPath
                ? "No arrays found in response"
                : widgetType === "chart" && !chartArrayPath
                ? "No objects found in response"
                : "No fields found"}
            </div>
          ) : (
            <div className="divide-y">
              {filteredFields.map((field, idx) => {
                const isSelected = selectedPaths.has(field.path);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {field.path}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          [{field.type}]
                        </span>
                      </div>
                      {field.isArray ? (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          [{Array.isArray(field.value) ? field.value.length : 0}{" "}
                          items]
                        </div>
                      ) : field.type === "object" ? (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {"{object}"}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {String(field.value).length > 50
                            ? String(field.value).slice(0, 50) + "..."
                            : String(field.value)}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onAddField(field)}
                      disabled={isSelected}
                      className="ml-2 shrink-0"
                    >
                      {isSelected ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
