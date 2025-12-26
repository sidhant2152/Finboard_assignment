import { Settings, Trash2, GripVertical, RefreshCw } from "lucide-react";
import type { Widget } from "@/types/widget.types";
// import { useDashboardStore } from '@/store/useDashboardStore';
import WidgetCard from "./WidgetCard";
import WidgetTable from "./WidgetTable";
import WidgetChart from "./WidgetChart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import WidgetLoading from "./WidgetLoading";

interface WidgetWrapperProps {
  widget: Widget;
}

export function WidgetWrapper({ widget }: WidgetWrapperProps) {
  const renderCard = () => {
    switch (widget.type) {
      case "card":
        return <WidgetCard widget={widget} />;
      case "table":
        return <WidgetTable widget={widget} />;
      case "chart":
        return <WidgetChart widget={widget} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div className="group flex h-full flex-col rounded-xl border border-border bg-card shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing drag-handle" />
          <h3 className="font-semibold text-sm text-foreground truncate">
            {widget.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            // onClick={handleRefresh}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            // onClick={handleConfigure}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            // onClick={handleRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-2">
        <Suspense fallback={<WidgetLoading />}>{renderCard()}</Suspense>
      </div>

      {/* Footer */}
      {widget.lastUpdated && (
        <div className="border-t border-border px-4 py-1.5 bg-secondary/20">
          <p className="text-[10px] text-muted-foreground">
            Updated: {new Date(widget.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
