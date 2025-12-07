import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchData(url: string, init?: RequestInit): Promise<any> {
  const response = await fetch(url, {
    method: init?.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API returned status ${response.status}`);
  }

  return await response.json();
}

export function exportDashboardConfig(config: {
  widgets: any[];
  totalWidgets: number;
}) {
  const dataStr = JSON.stringify(config, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dashboard-config-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importDashboardConfig(
  file: File
): Promise<{ widgets: any[]; totalWidgets: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        if (config.widgets && Array.isArray(config.widgets)) {
          resolve({
            widgets: config.widgets,
            totalWidgets: config.totalWidgets || config.widgets.length,
          });
        } else {
          reject(new Error("Invalid configuration format"));
        }
      } catch (error) {
        reject(new Error("Failed to parse JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
