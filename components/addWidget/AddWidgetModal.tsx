"use client";

import { useState, useMemo, useEffect } from "react";
import { useFetchCardData } from "@/hooks/useFetchCardData";
import { useAppDispatch } from "@/hooks";
import { addWidget, updateWidget } from "@/slices/widgetSlice";
import type { ChartType, Widget } from "@/types/widget.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RefreshCw, Eye } from "lucide-react";
import type {
  WidgetType,
  FieldMapping,
  TableFieldMapping,
  ChartFieldMapping,
  DataFormat,
  FlattenedField,
} from "@/types/widget.types";
import { FieldSelector } from "./FieldSelector";
import { SelectedFieldsConfig } from "./SelectedFieldsConfig";
import { toast } from "sonner";

interface AddWidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widget?: Widget;
}

export function AddWidgetModal({
  open,
  onOpenChange,
  widget,
}: AddWidgetModalProps) {
  const isEditMode = !!widget;
  const dispatch = useAppDispatch();

  // basic info
  const [widgetName, setWidgetName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(30);

  // response from api
  const testOptions = useMemo<RequestInit>(() => ({ method: "GET" }), []);
  const {
    data: apiResponse,
    error: apiError,
    isLoading: isTesting,
    refresh,
  } = useFetchCardData(
    apiUrl ? apiUrl : undefined,
    apiUrl ? testOptions : undefined
  );

  const testSuccess = !!apiResponse && !apiError;

  const [widgetType, setWidgetType] = useState<WidgetType>("card");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFields, setSelectedFields] = useState<FieldMapping[]>([]);

  // Table Widget State
  const [arrayPath, setArrayPath] = useState("");

  // Chart Widget State
  const [xFieldPath, setXFieldPath] = useState("");
  const [chartType, setChartType] = useState<ChartType>("line");

  // load existin data
  useEffect(() => {
    if (widget && open) {
      setWidgetName(widget.title);
      setApiUrl(widget.apiConfig.url);
      setRefreshInterval(widget.apiConfig.refreshInterval / 1000);
      setWidgetType(widget.type);

      if (widget.type === "card" && Array.isArray(widget.fieldMapping)) {
        setSelectedFields(widget.fieldMapping);
      } else if (
        widget.type === "table" &&
        "arrayPath" in widget.fieldMapping &&
        "columns" in widget.fieldMapping
      ) {
        const tableMapping = widget.fieldMapping as TableFieldMapping;
        setArrayPath(tableMapping.arrayPath);
        setSelectedFields(tableMapping.columns);
      } else if (
        widget.type === "chart" &&
        "xFieldPath" in widget.fieldMapping
      ) {
        const chartMapping = widget.fieldMapping as ChartFieldMapping;
        setXFieldPath(chartMapping.xFieldPath);
        setChartType(chartMapping.chartType);
        setSelectedFields(chartMapping.yFields);
      }
    }
  }, [widget, open]);

  const handleWidgetTypeChange = (newType: WidgetType) => {
    setWidgetType(newType);
    setSelectedFields([]);
    setArrayPath("");
    setXFieldPath("");
  };

  // Test API connection
  const handleTestApi = () => {
    if (!apiUrl.trim()) {
      return;
    }
    refresh();
  };

  const handleAddField = (field: FlattenedField) => {
    const newField: FieldMapping = {
      sourcePath: field.path,
      displayLabel: field.path.split(".").pop() || field.path,
      format: field.type === "number" ? "number" : "text",
    };

    if (widgetType === "card") {
      if (selectedFields.some((f) => f.sourcePath === field.path)) return;
      setSelectedFields([...selectedFields, newField]);
    } else if (widgetType === "table") {
      // case 1 -> select array for table
      if (!arrayPath && field.isArray) {
        setArrayPath(field.path);
        setSelectedFields([]);
      } else if (arrayPath) {
        // case 2 -> Select columns from array
        if (selectedFields.some((c) => c.sourcePath === field.path)) return;
        setSelectedFields([...selectedFields, newField]);
      }
    } else if (widgetType === "chart") {
      // case 1 -> Select object for X-axis
      if (!xFieldPath && field.type === "object") {
        setXFieldPath(field.path);
        setSelectedFields([]);
      } else if (xFieldPath) {
        // case 2 -> select Y axis fields
        if (selectedFields.some((f) => f.sourcePath === field.path)) return;
        setSelectedFields([...selectedFields, newField]);
      }
    }
  };

  const handleRemoveField = (index: number) => {
    setSelectedFields(selectedFields.filter((_, i) => i !== index));
  };

  const handleUpdateField = (
    index: number,
    updates: Partial<FieldMapping | { label: string; format: DataFormat }>
  ) => {
    setSelectedFields(
      selectedFields.map((field, i) =>
        i === index ? { ...field, ...updates } : field
      )
    );
  };

  // Validate form
  const isFormValid = () => {
    if (!widgetName.trim()) return false;
    if (!apiUrl.trim()) return false;
    if (!testSuccess || !apiResponse) return false;

    if (widgetType === "card") {
      return selectedFields.length > 0;
    } else if (widgetType === "table") {
      return arrayPath !== "" && selectedFields.length > 0;
    } else if (widgetType === "chart") {
      return xFieldPath !== "" && selectedFields.length > 0;
    }

    return false;
  };

  // Handle form submission
  const handleAddWidget = () => {
    if (!isFormValid()) return;

    let fieldMapping: FieldMapping[] | TableFieldMapping | ChartFieldMapping;

    if (widgetType === "card") {
      fieldMapping = selectedFields;
    } else if (widgetType === "table") {
      fieldMapping = {
        arrayPath: arrayPath,
        columns: selectedFields,
      };
    } else {
      fieldMapping = {
        xFieldPath: xFieldPath,
        chartType,
        yFields: selectedFields,
      };
    }

    if (isEditMode && widget) {
      // Update existing widget
      dispatch(
        updateWidget({
          id: widget.id,
          updates: {
            title: widgetName,
            type: widgetType,
            fieldMapping,
            apiConfig: {
              url: apiUrl,
              headers: widget.apiConfig.headers,
              refreshInterval: refreshInterval * 1000,
            },
          },
        })
      );
    } else {
      // Create new widget
      const widgetId = `widget-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newWidget = {
        id: widgetId,
        title: widgetName,
        type: widgetType,
        position: {
          x: 0,
          y: 0,
          width: widgetType === "card" ? 4 : 6,
          height: widgetType === "card" ? 4 : widgetType === "table" ? 8 : 6,
        },
        fieldMapping,
        apiConfig: {
          url: apiUrl,
          headers: {},
          refreshInterval: refreshInterval * 1000,
        },
      };

      dispatch(addWidget(newWidget));
    }

    handleClose();
  };

  const handleClose = () => {
    setWidgetName("");
    setApiUrl("");
    setRefreshInterval(30);
    setWidgetType("card");
    setSearchQuery("");
    setSelectedFields([]);
    setArrayPath("");
    setXFieldPath("");
    setChartType("line");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Widget" : "Add New Widget"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="widget-name">Widget Name</Label>
              <Input
                id="widget-name"
                type="text"
                value={widgetName}
                onChange={(e) => setWidgetName(e.target.value)}
                placeholder="Enter widget name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-url">API URL</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="api-url"
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://api.example.com/data"
                  className="flex-1"
                />
                <Button
                  onClick={handleTestApi}
                  disabled={isTesting || !apiUrl.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white sm:w-auto w-full"
                >
                  {isTesting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Test
                </Button>
              </div>
              {testSuccess && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Eye className="h-4 w-4" />
                  <span>API connection successful!</span>
                </div>
              )}
              {apiError && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {apiError}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="refresh-interval">
                Refresh Interval (seconds)
              </Label>
              <Input
                id="refresh-interval"
                type="number"
                value={refreshInterval}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 1) {
                    setRefreshInterval(value);
                  } else {
                    toast.warning("Interval cannot be less than 1");
                  }
                }}
                placeholder="30"
              />
            </div>
          </div>

          {/* Display Mode Selection */}
          {testSuccess && (
            <div>
              <Label className="mb-3 block">Select Fields to Display</Label>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Display Mode:
                </p>
                <RadioGroup
                  value={widgetType}
                  onValueChange={(value) =>
                    handleWidgetTypeChange(value as WidgetType)
                  }
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className={
                        widgetType === "card"
                          ? "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          : ""
                      }
                    />
                    <Label
                      htmlFor="card"
                      className="cursor-pointer font-normal"
                    >
                      Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="table"
                      id="table"
                      className={
                        widgetType === "table"
                          ? "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          : ""
                      }
                    />
                    <Label
                      htmlFor="table"
                      className="cursor-pointer font-normal"
                    >
                      Table
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="chart"
                      id="chart"
                      className={
                        widgetType === "chart"
                          ? "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          : ""
                      }
                    />
                    <Label
                      htmlFor="chart"
                      className="cursor-pointer font-normal"
                    >
                      Chart
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Chart-specific config */}
              {widgetType === "chart" && (
                <div className="space-y-3 mb-4 p-3 border rounded-md bg-secondary/30">
                  <div className="space-y-2">
                    <Label>Chart Type</Label>
                    <RadioGroup
                      value={chartType}
                      onValueChange={(value) =>
                        setChartType(value as "line" | "candlestick")
                      }
                      className="flex flex-wrap gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="line" id="line" />
                        <Label
                          htmlFor="line"
                          className="cursor-pointer font-normal"
                        >
                          Line
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="candlestick" id="candlestick" />
                        <Label
                          htmlFor="candlestick"
                          className="cursor-pointer font-normal"
                        >
                          Candlestick
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {!xFieldPath && (
                    <p className="text-xs text-muted-foreground">
                      Select an object path from available fields to continue
                    </p>
                  )}
                </div>
              )}

              {/* Field Selector */}
              <FieldSelector
                apiResponse={apiResponse}
                widgetType={widgetType}
                arrayPath={arrayPath}
                chartArrayPath={xFieldPath}
                selectedFields={selectedFields}
                onAddField={handleAddField}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {/* Selected Fields */}
              <SelectedFieldsConfig
                widgetType={widgetType}
                selectedFields={selectedFields}
                onUpdateField={handleUpdateField}
                onRemoveField={handleRemoveField}
                arrayPath={arrayPath}
                onClearArrayPath={() => setArrayPath("")}
                chartArrayPath={xFieldPath}
                onClearChartArrayPath={() => setXFieldPath("")}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddWidget}
            disabled={!isFormValid()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isEditMode ? "Update Widget" : "Add Widget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
