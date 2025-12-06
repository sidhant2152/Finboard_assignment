"use client";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { MappedTableData, DataFormat } from "@/types/widget.types";
import { cn } from "@/lib/utils";
import { formatValue } from "@/lib/mappers";

interface TableClientProps {
  data: MappedTableData;
}

type SortDirection = "asc" | "desc";

export default function TableClient({ data }: TableClientProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!data || !data.rows) return [];

    let filtered = data.rows.filter((row) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      return data.columns.some((col) => {
        const value = row[col.key];
        return String(value || "")
          .toLowerCase()
          .includes(searchLower);
      });
    });

    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const direction = sortDirection === "asc" ? 1 : -1;

        // Handle numeric values
        const aNum =
          typeof aVal === "string" && !isNaN(Number(aVal))
            ? Number(aVal)
            : typeof aVal === "number"
            ? aVal
            : null;
        const bNum =
          typeof bVal === "string" && !isNaN(Number(bVal))
            ? Number(bVal)
            : typeof bVal === "number"
            ? bVal
            : null;

        if (aNum !== null && bNum !== null) {
          return (aNum - bNum) * direction;
        }

        // Handle string values
        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal) * direction;
        }

        return 0;
      });
    }

    return filtered;
  }, [data, search, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (!data || !data.columns || data.columns.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">No columns configured</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="flex-shrink-0 p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-9 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border">
              {data.columns.map((column) => (
                <SortableHeader
                  key={column.key}
                  label={column.label}
                  field={column.key}
                  currentField={sortField}
                  direction={sortDirection}
                  onClick={handleSort}
                  align={
                    column.format === "currency" ||
                    column.format === "number" ||
                    column.format === "percent"
                      ? "right"
                      : "left"
                  }
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/50 transition-colors hover:bg-secondary/30"
              >
                {data.columns.map((column) => {
                  const value = row[column.key];
                  const formatted = formatValue(column.format!, value);
                  const isNumeric =
                    column.format === "currency" ||
                    column.format === "number" ||
                    column.format === "percent";
                  const isPercent = column.format === "percent";
                  const numValue =
                    typeof value === "number"
                      ? value
                      : typeof value === "string" && !isNaN(Number(value))
                      ? Number(value)
                      : null;

                  return (
                    <td
                      key={column.key}
                      className={cn(
                        "p-3 text-sm",
                        isNumeric && "text-right font-mono",
                        !isNumeric && "text-left"
                      )}
                    >
                      {isPercent && numValue !== null ? (
                        <div
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                            numValue >= 0
                              ? "bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          )}
                        >
                          {numValue >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {formatted}
                        </div>
                      ) : (
                        <span
                          className={cn(
                            isNumeric && "font-medium text-foreground",
                            !isNumeric && "text-foreground"
                          )}
                        >
                          {formatted}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedData.length === 0 && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onClick,
  align = "left",
}: {
  label: string;
  field: string;
  currentField: string | null;
  direction: SortDirection;
  onClick: (field: string) => void;
  align?: "left" | "right";
}) {
  const isActive = currentField === field;

  return (
    <th
      className={cn(
        "p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none transition-colors hover:text-foreground",
        align === "right" && "text-right"
      )}
      onClick={() => onClick(field)}
    >
      <div
        className={cn(
          "flex items-center gap-1",
          align === "right" && "justify-end"
        )}
      >
        {label}
        <span className="flex flex-col">
          <ChevronUp
            className={cn(
              "h-3 w-3 -mb-1",
              isActive && direction === "asc"
                ? "text-primary"
                : "text-muted-foreground/30"
            )}
          />
          <ChevronDown
            className={cn(
              "h-3 w-3",
              isActive && direction === "desc"
                ? "text-primary"
                : "text-muted-foreground/30"
            )}
          />
        </span>
      </div>
    </th>
  );
}
