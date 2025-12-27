"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface FieldItemProps {
  field: FieldMapping;
  layout?: "vertical" | "horizontal";
  showFormat?: boolean;
  placeholder?: string;
  onUpdate: (updates: Partial<FieldMapping>) => void;
  onRemove: () => void;
}

function FieldItem({
  field,
  layout = "horizontal",
  showFormat = true,
  placeholder = "Display Label",
  onUpdate,
  onRemove,
}: FieldItemProps) {
  const isVertical = layout === "vertical";

  return (
    <div
      className={`group relative ${
        isVertical
          ? "flex flex-col gap-3 p-3 border border-border/50 rounded-lg bg-card/50 hover:bg-card/80 transition-all shadow-sm"
          : "flex items-start gap-3 p-3 border border-border/50 rounded-lg bg-card/50 hover:bg-card/80 transition-all shadow-sm"
      }`}
    >
      {isVertical && (
        <div className="flex items-center justify-between pb-2 border-b border-border/30">
          <div className="text-xs font-mono text-muted-foreground/80 truncate max-w-[80%]">
            {field.sourcePath}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      <div
        className={
          isVertical ? "w-full space-y-2.5" : "flex-1 space-y-2 min-w-0"
        }
      >
        <div className="space-y-1.5">
          <Input
            type="text"
            value={field.displayLabel}
            onChange={(e) => onUpdate({ displayLabel: e.target.value })}
            className="h-9 text-sm border-border/50 focus:border-primary/50 transition-colors"
            placeholder={placeholder}
          />
          {!isVertical && (
            <div className="text-xs font-mono text-muted-foreground/70 truncate px-1">
              {field.sourcePath}
            </div>
          )}
        </div>
        {showFormat && (
          <Select
            value={field.format}
            onValueChange={(value) => onUpdate({ format: value as DataFormat })}
          >
            <SelectTrigger className="h-9 text-xs border-border/50 focus:border-primary/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="percent">Percent</SelectItem>
              <SelectItem value="currency">Currency</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {!isVertical && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="h-8 w-8 mt-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

interface SelectedFieldsConfigProps {
  widgetType: WidgetType;
  selectedFields: FieldMapping[];
  onUpdateField: (
    index: number,
    updates: Partial<FieldMapping | { label: string; format: DataFormat }>
  ) => void;
  onRemoveField: (index: number) => void;
  arrayPath: string;
  onClearArrayPath: () => void;
  chartArrayPath: string;
  onClearChartArrayPath: () => void;
}

export function SelectedFieldsConfig({
  widgetType,
  selectedFields,
  onUpdateField,
  onRemoveField,
  arrayPath,
  onClearArrayPath,
  chartArrayPath,
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
              <FieldItem
                key={field.sourcePath}
                field={field}
                layout="vertical"
                showFormat={true}
                onUpdate={(updates) => onUpdateField(idx, updates)}
                onRemove={() => onRemoveField(idx)}
              />
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
                {selectedFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No columns selected
                  </p>
                ) : (
                  selectedFields.map((col, idx) => (
                    <FieldItem
                      key={col.sourcePath}
                      field={col}
                      layout="horizontal"
                      showFormat={true}
                      placeholder="Column Label"
                      onUpdate={(updates) => onUpdateField(idx, updates)}
                      onRemove={() => onRemoveField(idx)}
                    />
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
                {selectedFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No Y fields selected
                  </p>
                ) : (
                  selectedFields.map((field, idx) => (
                    <FieldItem
                      key={field.sourcePath}
                      field={field}
                      layout="horizontal"
                      showFormat={false}
                      onUpdate={(updates) => onUpdateField(idx, updates)}
                      onRemove={() => onRemoveField(idx)}
                    />
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
