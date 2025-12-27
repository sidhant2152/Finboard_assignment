import type { WidgetConfig, Widget } from "@/types/widget.types";

export interface Preset {
  name: string;
  config: WidgetConfig;
}

export const PRESETS: Preset[] = [
  {
    name: "Preset 1",
    config: {
      widgets: [
        {
          id: "widget-1765117017840-ajmct0noz",
          title: "Top Gainers Table",
          type: "table",
          position: {
            x: 0,
            y: 0,
            width: 6,
            height: 7,
          },
          fieldMapping: {
            arrayPath: "top_gainers",
            columns: [
              {
                sourcePath: "ticker",
                displayLabel: "Name",
                format: "text",
              },
              {
                sourcePath: "price",
                displayLabel: "Price",
                format: "number",
              },
              {
                sourcePath: "change_amount",
                displayLabel: "Change Amount",
                format: "number",
              },
              {
                sourcePath: "change_percentage",
                displayLabel: "Change Percentage",
                format: "percent",
              },
              {
                sourcePath: "volume",
                displayLabel: "Volume",
                format: "number",
              },
            ],
          },
          apiConfig: {
            url: "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo",
            headers: {},
            refreshInterval: 100000,
          },
        },
        {
          id: "widget-1765117070787-vr1mm1g9x",
          title: "BTC Candlestick",
          type: "chart",
          position: {
            x: 6,
            y: 0,
            width: 6,
            height: 6,
          },
          fieldMapping: {
            xFieldPath: "Time Series (Daily)",
            chartType: "candlestick",
            yFields: [
              {
                sourcePath: "1. open",
                displayLabel: " open",
                format: "text",
              },
              {
                sourcePath: "2. high",
                displayLabel: " high",
                format: "text",
              },
              {
                sourcePath: "3. low",
                displayLabel: " low",
                format: "text",
              },
              {
                sourcePath: "4. close",
                displayLabel: " close",
                format: "text",
              },
              {
                sourcePath: "5. volume",
                displayLabel: " volume",
                format: "text",
              },
            ],
          },
          apiConfig: {
            url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo",
            headers: {},
            refreshInterval: 60000,
          },
        },
        {
          id: "widget-1765117125338-7ny9ou7jb",
          title: "BTC Open Close",
          type: "chart",
          position: {
            x: 0,
            y: 7,
            width: 6,
            height: 6,
          },
          fieldMapping: {
            xFieldPath: "Time Series (Daily)",
            chartType: "line",
            yFields: [
              {
                sourcePath: "1. open",
                displayLabel: " open",
                format: "text",
              },
              {
                sourcePath: "4. close",
                displayLabel: " close",
                format: "text",
              },
            ],
          },
          apiConfig: {
            url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo",
            headers: {},
            refreshInterval: 30000,
          },
        },
        {
          id: "widget-1765117231498-qc5nfkbev",
          title: "Exchange Rate Card",
          type: "card",
          position: {
            x: 7,
            y: 6,
            width: 5,
            height: 5,
          },
          fieldMapping: [
            {
              sourcePath:
                "Realtime Currency Exchange Rate.2. From_Currency Name",
              displayLabel: "From",
              format: "text",
            },
            {
              sourcePath: "Realtime Currency Exchange Rate.4. To_Currency Name",
              displayLabel: " To",
              format: "text",
            },
            {
              sourcePath: "Realtime Currency Exchange Rate.5. Exchange Rate",
              displayLabel: " Exchange Rate",
              format: "number",
            },
            {
              sourcePath: "Realtime Currency Exchange Rate.8. Bid Price",
              displayLabel: " Bid Price",
              format: "number",
            },
            {
              sourcePath: "Realtime Currency Exchange Rate.9. Ask Price",
              displayLabel: " Ask Price",
              format: "number",
            },
          ],
          apiConfig: {
            url: "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo",
            headers: {},
            refreshInterval: 30000,
          },
        },
      ],
      totalWidgets: 4,
    },
  },
];
