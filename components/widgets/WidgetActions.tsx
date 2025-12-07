"use client";

import { RefreshCw, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks";
import { removeWidget } from "@/slices/widgetSlice";
import type { Widget } from "@/types/widget.types";

interface WidgetActionsProps {
  widget: Widget;
  onRefresh?: () => void;
  onConfigure?: () => void;
}

export function WidgetActions({
  widget,
  onRefresh,
  onConfigure,
}: WidgetActionsProps) {
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(removeWidget(widget.id));
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleConfigure = () => {
    if (onConfigure) {
      onConfigure();
    }
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleRefresh}
        title="Refresh"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleConfigure}
        title="Configure"
      >
        <Settings className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={handleRemove}
        title="Remove"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
