import { WidgetWrapper } from "@/components/widgets/WidgetWrapper";
import type { Widget } from "@/types/widget.types";
import { DashboardGrid } from "@/components/layout/Dashboard";

const widgets: Widget[] = [
  {
    id: "1",
    title: "Widget 1",
    type: "card",
    lastUpdated: new Date(),
    position: { x: 0, y: 0, width: 100, height: 100 },
    fieldMapping: [
      {
        sourcePath: "Realtime Currency Exchange Rate.5. Exchange Rate",
        displayLabel: "Exchange Rate",
        format: "number",
      },
      {
        sourcePath: "Realtime Currency Exchange Rate.6. Last Refreshed",
        displayLabel: "Updated At",
        format: "text",
      },
    ],
    apiConfig: {
      url: "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo",
      headers: {},
      refreshInterval: 0,
    },
  },
];

export default function Home() {
  return (
    <div>
      <DashboardGrid>
        {widgets.map((widget) => (
          <div key={widget.id} className="widget-grid-item">
            <WidgetWrapper widget={widget} />
          </div>
        ))}
      </DashboardGrid>
    </div>
  );
}
