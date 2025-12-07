"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  WidgetType,
  FieldMapping,
  DataFormat,
} from "@/types/widget.types";

interface SelectedFieldsConfigProps {
  widgetType: WidgetType;
  selectedFields: FieldMapping[];
  onUpdateField: (
    index: number,
    updates: Partial<FieldMapping | { label: string; format: DataFormat }>
  ) => void;
  onRemoveField: (index: number) => void;
  arrayPath: string;
  selectedColumns: Array<{
    sourcePath: string;
    label: string;
    format: DataFormat;
  }>;
  onClearArrayPath: () => void;
  chartArrayPath: string;
  selectedYFields: Array<{
    sourcePath: string;
    displayLabel: string;
    format?: DataFormat;
  }>;
  onClearChartArrayPath: () => void;
}

export function SelectedFieldsConfig({
  widgetType,
  selectedFields,
  onUpdateField,
  onRemoveField,
  arrayPath,
  selectedColumns,
  onClearArrayPath,
  chartArrayPath,
  selectedYFields,
  onClearChartArrayPath,
}: SelectedFieldsConfigProps) {
  return (
    <div className="pt-6">
      <h3 className="text-sm font-medium mb-2">Selected Fields</h3>
      {/* Selected fields for cards */}
      {widgetType === "card" && (
        <div className="space-y-2">
          {selectedFields.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">
              No fields selected
            </p>
          ) : (
            selectedFields.map((field, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 p-2 border rounded-md bg-secondary/30"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-muted-foreground truncate">
                    {field.sourcePath}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemoveField(idx)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Input
                  type="text"
                  value={field.displayLabel}
                  onChange={(e) =>
                    onUpdateField(idx, { displayLabel: e.target.value })
                  }
                  className="h-8 text-sm"
                  placeholder="Display Label"
                />

                <Select
                  value={field.format}
                  onValueChange={(value) =>
                    onUpdateField(idx, { format: value as DataFormat })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="percent">Percent</SelectItem>
                    <SelectItem value="currency">Currency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))
          )}
        </div>
      )}

      {widgetType === "table" && (
        <div className="space-y-3">
          {!arrayPath ? (
            <p className="text-sm text-muted-foreground p-2">
              Select an array path from available fields
            </p>
          ) : (
            <>
              <div className="p-2 border rounded-md bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Array Path</div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {arrayPath}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClearArrayPath}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {selectedColumns.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No columns selected
                  </p>
                ) : (
                  selectedColumns.map((col, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 border rounded-md bg-secondary/30"
                    >
                      <div className="flex-1 space-y-1">
                        <Input
                          type="text"
                          value={col.label}
                          onChange={(e) =>
                            onUpdateField(idx, {
                              label: e.target.value,
                            })
                          }
                          className="h-8 text-sm"
                          placeholder="Column Label"
                        />
                        <div className="text-xs font-mono text-muted-foreground">
                          {col.sourcePath}
                        </div>
                        <Select
                          value={col.format}
                          onValueChange={(value) =>
                            onUpdateField(idx, {
                              format: value as DataFormat,
                            })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="percent">Percent</SelectItem>
                            <SelectItem value="currency">Currency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onRemoveField(idx)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {widgetType === "chart" && (
        <div className="space-y-3">
          {!chartArrayPath ? (
            <p className="text-sm text-muted-foreground p-2">
              Select an array path from available fields
            </p>
          ) : (
            <>
              <div className="p-2 border rounded-md bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium">Array Path</div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {chartArrayPath}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClearChartArrayPath}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {selectedYFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No Y fields selected
                  </p>
                ) : (
                  selectedYFields.map((field, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 border rounded-md bg-secondary/30"
                    >
                      <div className="flex-1 space-y-1">
                        <Input
                          type="text"
                          value={field.displayLabel}
                          onChange={(e) =>
                            onUpdateField(idx, {
                              displayLabel: e.target.value,
                            })
                          }
                          className="h-8 text-sm"
                          placeholder="Display Label"
                        />
                        <div className="text-xs font-mono text-muted-foreground">
                          {field.sourcePath}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onRemoveField(idx)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
