"use client";

import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";
import type { Widget } from "@/types/widget.types";
import WidgetCard from "./card/WidgetCard";
import WidgetTable from "./table/WidgetTable";
import WidgetChart from "./chart/WidgetChart";
import { WidgetActions } from "./WidgetActions";
import { AddWidgetModal } from "@/components/addWidget/AddWidgetModal";
import { useFetchCardData } from "@/hooks/useFetchCardData";
import { CardLoading } from "./CardLoading";
import { CardError } from "./CardError";

export function WidgetWrapper({ widget }: { widget: Widget }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const options = useMemo<RequestInit>(
    () => ({
      method: "GET",
      headers: widget.apiConfig.headers as Record<string, string> | undefined,
    }),
    [widget.apiConfig.headers]
  );

  const { data, error, isLoading, refresh } = useFetchCardData(
    widget.apiConfig.url,
    options,
    widget.apiConfig.refreshInterval > 0
      ? widget.apiConfig.refreshInterval
      : undefined
  );

  const handleRefresh = () => {
    refresh();
  };

  const handleConfigure = () => {
    setIsEditModalOpen(true);
  };

  const renderWidgetContent = () => {
    if (isLoading) return <CardLoading />;
    if (error) return <CardError message={`Error: ${error}`} />;
    if (!data) return <CardError message="No data" />;

    switch (widget.type) {
      case "card":
        return <WidgetCard widget={widget} data={data} />;
      case "table":
        return <WidgetTable widget={widget} data={data} />;
      case "chart":
        return <WidgetChart widget={widget} data={data} />;
      default:
        return <CardError message="Unknown widget type" />;
    }
  };

  return (
    <div className="group flex h-full flex-col rounded-md border border-border bg-card shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing drag-handle" />
          <h3 className="font-semibold text-sm text-foreground truncate">
            {widget.title}
          </h3>
        </div>
        <WidgetActions
          widget={widget}
          onRefresh={handleRefresh}
          onConfigure={handleConfigure}
        />
      </div>

      <div className="flex-1 overflow-hidden p-2">{renderWidgetContent()}</div>

      {
        <div className="border-t border-border px-4 py-1.5 bg-secondary/20">
          <p className="text-[10px] text-muted-foreground">
            Updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      }

      {/* Edit Modal */}
      <AddWidgetModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        widget={widget}
      />
    </div>
  );
}
