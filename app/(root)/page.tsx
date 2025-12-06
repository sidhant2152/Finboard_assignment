import { WidgetWrapper } from "@/components/widgets/WidgetWrapper";
import type { Widget } from "@/types/widget.types";
import { DashboardGrid } from "@/components/layout/Dashboard";

const widgets: Widget[] = [
  {
    id: "1",
    title: "Widget 1",
    type: "card",
    lastUpdated: new Date(),
    position: { x: 0, y: 0, width: 4, height: 4 },
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
  {
    id: "widget-gainers-1",
    title: "Top Gainers",
    type: "table",
    lastUpdated: new Date(),
    position: { x: 0, y: 0, width: 6, height: 8 },

    // card-specific fieldMapping (not used in tables but required by your type)

    apiConfig: {
      url: "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo",
      headers: {},
      refreshInterval: 30000,
    },

    fieldMapping: {
      arrayPath: "top_gainers",
      columns: [
        {
          sourcePath: "ticker",
          label: "Ticker",
          format: "text",
        },
        {
          sourcePath: "price",
          label: "Price",
          format: "number",
        },
        {
          sourcePath: "change_percentage",
          label: "Change %",
          format: "percent",
        },
        {
          sourcePath: "volume",
          label: "Volume",
          format: "number",
        },
      ],
    },
  },
  {
    id: "widget_line_1",
    title: "IBM – Close vs High (Line Chart)",
    type: "chart",
    lastUpdated: new Date(),
    position: { x: 0, y: 8, width: 6, height: 6 },

    fieldMapping: {
      arrayPath: "Time Series (5min)", // parent that contains timestamp → OHLCV
      xField: "__key", // timestamp key is our X axis
      chartType: "line",

      // Two lines: Close + High
      yFields: [
        {
          sourcePath: "4. close",
          displayLabel: "Close Price",
          format: "number",
        },
        {
          sourcePath: "2. high",
          displayLabel: "High Price",
          format: "number",
        },
      ],
    },

    apiConfig: {
      url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo",
      headers: {},
      refreshInterval: 300000, // 5 min
    },
  },
  {
    id: "widget_candle_1",
    title: "IBM – Intraday Candlestick",
    type: "chart",
    lastUpdated: new Date(),
    position: { x: 6, y: 8, width: 6, height: 6 },

    fieldMapping: {
      arrayPath: "Time Series (5min)", // same parent object
      xField: "__key", // timeline is the timestamp

      chartType: "candlestick",

      yFields: [
        { sourcePath: "1. open", displayLabel: "Open", format: "number" },
        { sourcePath: "2. high", displayLabel: "High", format: "number" },
        { sourcePath: "3. low", displayLabel: "Low", format: "number" },
        { sourcePath: "4. close", displayLabel: "Close", format: "number" },
        { sourcePath: "5. volume", displayLabel: "Volume", format: "number" },
      ],
    },

    apiConfig: {
      url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo",
      headers: {},
      refreshInterval: 300000,
    },
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-[1920px] mx-auto">
        <DashboardGrid>
          {widgets.map((widget) => (
            <div key={widget.id}>
              <WidgetWrapper widget={widget} />
            </div>
          ))}
        </DashboardGrid>
      </div>
    </div>
  );
}
