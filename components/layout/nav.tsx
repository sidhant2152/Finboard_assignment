"use client";

import React, { useRef } from "react";
import { Download, Upload } from "lucide-react";
import AddWidgetAction from "../addWidget/AddWidgetAction";
import { PresetDropdown } from "../addWidget/PresetDropdown";
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
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-md supports-backdrop-filter:bg-card/60 shadow-md">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent truncate">
            FinBoard
          </h1>
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
            <ModeToggle />
            <PresetDropdown />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={widgets.length === 0}
              className="flex items-center gap-1 sm:gap-2 border-border/50 hover:bg-accent hover:text-accent-foreground transition-colors px-2 sm:px-3"
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportClick}
              className="flex items-center gap-1 sm:gap-2 border-border/50 hover:bg-accent hover:text-accent-foreground transition-colors px-2 sm:px-3"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden md:inline">Import</span>
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
    </nav>
  );
};
