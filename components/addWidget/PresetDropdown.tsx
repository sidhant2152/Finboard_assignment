"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/hooks";
import { loadWidgets } from "@/slices/widgetSlice";
import { PRESETS } from "@/lib/presets";
import { toast } from "sonner";

export function PresetDropdown() {
  const dispatch = useAppDispatch();

  const handlePresetSelect = (presetIndex: number) => {
    const preset = PRESETS[presetIndex];
    if (preset) {
      dispatch(loadWidgets(preset.config));
      toast.success(`Preset "${preset.name}" loaded successfully!`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-border/50 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <span className="hidden sm:inline">Presets</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {PRESETS.map((preset, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handlePresetSelect(index)}
            className="cursor-pointer"
          >
            {preset.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
