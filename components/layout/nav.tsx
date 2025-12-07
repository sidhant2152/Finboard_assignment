"use client";

import React, { useRef } from "react";
import { Download, Upload } from "lucide-react";
import AddWidgetAction from "../addWidget/AddWidgetAction";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/theme-toggle";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { loadWidgets } from "@/slices/widgetSlice";
import { exportDashboardConfig, importDashboardConfig } from "@/lib/utils";
import { toast } from "sonner";

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const { widgets, totalWidgets } = useAppSelector((state) => state.widget);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportDashboardConfig({ widgets, totalWidgets });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const config = await importDashboardConfig(file);
      dispatch(loadWidgets(config));
      toast.success("Configuration imported successfully!");
    } catch (error) {
      toast.error("Failed to import configuration :(");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="px-4 py-6 border-b border-gray-500">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">FinBoard</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={widgets.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <AddWidgetAction />
        </div>
      </div>
    </div>
  );
};
