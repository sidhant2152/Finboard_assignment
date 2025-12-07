# FinBoard - Customizable Finance Dashboard

A powerful, real-time finance monitoring dashboard builder that allows users to create custom widgets by connecting to various financial APIs. Built with Next.js, React, and Redux Toolkit, FinBoard provides an intuitive interface for building personalized financial dashboards with drag-and-drop functionality.

### 📽 Project Walkthrough Video

🔗 **Watch here:** https://drive.google.com/drive/folders/15w3toY1sn6_-9qOcU-cRSfzin-iXMme8

## 🎯 Overview

FinBoard is a comprehensive finance dashboard solution that enables users to:

- Connect to any financial API endpoint
- Create custom widgets (Cards, Tables, Charts)
- Dynamically map API response fields
- Arrange widgets with drag-and-drop
- Persist configurations across sessions
- Export/import dashboard configurations
- Use pre-built dashboard presets

## ✨ Features

### 1. Widget Management System

#### **Add Widgets**

Users can create three types of finance data widgets:

- **📊 Table Widget**: Displays data in a sortable table format

  - Supports array-based API responses
  - Custom column selection and formatting
  - Search and filter functionality
  - Sortable columns with visual indicators

- **💳 Card Widget**: Displays key-value pairs in a clean card format

  - Perfect for watchlists, market gainers, performance data
  - Custom field selection from API responses
  - Multiple data format support (text, number, percent)

- **📈 Chart Widget**: Visualizes data with interactive charts
  - **Line Charts**: Time-series data visualization
  - **Candlestick Charts**: OHLC (Open, High, Low, Close) data with volume
  - Multiple Y-axis field support
  - Interactive tooltips and zoom

#### **Remove Widgets**

- One-click widget deletion
- Automatic layout adjustment

#### **Rearrange Layout**

- Full drag-and-drop functionality using `react-grid-layout`
- Resizable widgets with minimum size constraints
- Real-time position updates
- Automatic persistence of layout changes

#### **Widget Configuration**

- Comprehensive configuration panel for each widget
- Edit widget title, API endpoint, refresh interval
- Modify field mappings and display formats
- Update widget type and position

### 2. API Integration & Data Handling

#### **Dynamic Data Mapping**

- **Interactive JSON Explorer**: Visual interface to explore API responses
- **Field Selection**: Click to select fields from flattened JSON structure
- **Path-based Mapping**: Uses dot-notation paths for nested data access
- **Type Detection**: Automatically detects field types (string, number, boolean, object, array)

#### **Real-time Updates**

- Configurable refresh intervals (minimum 1 second)
- Automatic polling with customizable intervals
- Manual refresh option per widget

#### **Data Caching & Optimization**

- Intelligent data fetching with `useFetchCardData` hook
- Prevents redundant API calls
- Loading states with skeleton UI

### 3. User Interface & Experience

#### **Customizable Widgets**

- Editable widget titles
- Custom display labels for fields
- Multiple data format options:
  - **Text**: Plain text display
  - **Number**: Formatted numbers with thousand separators
  - **Currency**: Currency formatting (extensible)
  - **Percent**: Percentage display with +/- indicators

#### **Responsive Design**

- Fully responsive layout supporting multiple screen sizes
- Mobile-friendly navigation
- Adaptive grid system (12-column layout)
- Touch-friendly drag-and-drop on mobile devices

#### **Loading & Error States**

- Skeleton loading animations
- Comprehensive error messages
- Empty state handling
- Network error recovery

#### **Theme Support**

- **Dark/Light Mode**: Seamless theme switching
- System preference detection
- Persistent theme selection
- Smooth transitions between themes

### 4. Data Persistence

#### **Browser Storage Integration**

- All widget configurations stored in `localStorage`
- Dashboard layouts persist across sessions
- Automatic state recovery on page refresh
- Type-safe storage utilities

#### **State Recovery**

- Complete dashboard restoration on page load
- Widget positions and sizes preserved
- API configurations maintained
- Field mappings retained

#### **Configuration Backup**

- **Export**: Download dashboard configuration as JSON
- **Import**: Upload and restore dashboard from JSON file
- **Presets**: Pre-built dashboard templates
  - Quick setup with one click
  - Multiple preset options
  - Customizable preset library

### 5. Advanced Widget Features

#### **Field Selection Interface**

- Interactive JSON explorer
- Search functionality to find fields quickly
- Visual type indicators
- Array/object path selection for complex data structures

#### **Custom Formatting**

- Format selection per field
- Real-time format preview
- Support for multiple numeric formats
- Custom display labels

#### **Widget Naming**

- User-defined widget titles
- Descriptive labels for better organization
- Easy identification in dashboard

#### **API Endpoint Management**

- Easy API URL input
- Test connection before saving
- Custom headers support
- Refresh interval configuration

## 🛠️ Technologies

### Core Framework

- **Next.js 16.0.7**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript 5.0**: Type safety

### State Management

- **Redux Toolkit 2.11.0**: Centralized state management
- **React Redux 9.2.0**: React bindings for Redux

### UI Components

- **Radix UI**: Accessible component primitives
  - Dialog, Dropdown Menu, Select, Radio Group, Checkbox
- **Tailwind CSS 4**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### Data Visualization

- **Lightweight Charts 5.0.9**: High-performance charting library
  - Line charts
  - Candlestick charts
  - Histogram charts

### Layout & Interaction

- **React Grid Layout 1.5.3**: Drag-and-drop grid system
- **Flat 6.0.1**: JSON flattening utility

### Theming

- **Next Themes 0.4.6**: Theme management

## 📁 Project Structure

```
finboard-assignment/
├── app/
│   ├── (root)/
│   │   └── page.tsx          # Main dashboard page
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Global styles
├── components/
│   ├── addWidget/
│   │   ├── AddWidgetAction.tsx      # Add widget button
│   │   ├── AddWidgetModal.tsx        # Main widget configuration modal
│   │   ├── FieldSelector.tsx         # JSON field explorer
│   │   ├── PresetDropdown.tsx       # Preset selection dropdown
│   │   └── SelectedFieldsConfig.tsx  # Field configuration panel
│   ├── layout/
│   │   ├── Dashboard.tsx     # Grid layout component
│   │   ├── nav.tsx           # Navigation bar
│   │   ├── ReduxProvider.tsx # Redux store provider
│   │   └── theme-provider.tsx # Theme provider
│   ├── ui/                   # Reusable UI components
│   └── widgets/
│       ├── card/
│       │   └── WidgetCard.tsx        # Card widget component
│       ├── chart/
│       │   ├── ChartClient.tsx       # Chart rendering client
│       │   └── WidgetChart.tsx      # Chart widget wrapper
│       ├── table/
│       │   ├── TableClient.tsx      # Table rendering client
│       │   └── WidgetTable.tsx      # Table widget wrapper
│       ├── CardError.tsx     # Error state component
│       ├── CardLoading.tsx   # Loading state component
│       ├── WidgetActions.tsx # Widget action buttons
│       └── WidgetWrapper.tsx # Main widget wrapper
├── hooks/
│   ├── useFetchCardData.ts   # Data fetching hook
│   └── hooks.ts              # Redux hooks
├── lib/
│   ├── mappers.ts            # Data transformation utilities
│   ├── presets.ts            # Dashboard presets
│   └── utils.ts              # General utilities
├── slices/
│   └── widgetSlice.ts        # Redux slice for widgets
├── store/
│   └── index.ts              # Redux store configuration
└── types/
    └── widget.types.ts       # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finboard-assignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Creating a Widget

1. **Click "Add Widget"** button in the navbar
2. **Enter Widget Details**:
   - Widget Name
   - API URL (e.g., Alpha Vantage endpoint)
   - Refresh Interval (in seconds, minimum 1)
3. **Test API Connection**: Click "Test" to verify the API endpoint
4. **Select Widget Type**: Choose between Card, Table, or Chart
5. **Configure Fields**:
   - For **Card**: Select individual fields from the API response
   - For **Table**: First select an array path, then choose columns
   - For **Chart**: Select object path for X-axis, then Y-axis fields
6. **Customize Display**:
   - Edit display labels
   - Choose data formats (text, number, percent, currency)
7. **Save Widget**: Click "Add Widget" to create

### Managing Widgets

- **Drag & Drop**: Click and drag the grip icon to move widgets
- **Resize**: Drag widget corners to resize
- **Edit**: Click the configure icon to modify widget settings
- **Refresh**: Click the refresh icon to manually update data
- **Delete**: Click the delete icon to remove a widget

### Using Presets

1. Click **"Presets"** dropdown in the navbar
2. Select a preset from the list
3. The dashboard will load with pre-configured widgets

### Export/Import

- **Export**: Click "Export" to download your dashboard configuration as JSON
- **Import**: Click "Import" and select a JSON file to restore a dashboard

### Data Mapping Strategy

The application uses a flexible field mapping system:

1. **Flattening**: API responses are flattened using dot-notation

   - Example: `{user: {name: "John"}}` → `"user.name": "John"`

2. **Path-based Access**: Fields are accessed using source paths

   - Supports nested objects and arrays
   - Handles array indices: `"items.0.price"`

3. **Type Detection**: Automatic type detection for proper formatting

   - String, Number, Boolean, Object, Array

4. **Format Transformation**: Data is formatted based on selected format
   - Numbers: Thousand separators
   - Percentages: Automatic conversion and +/- indicators

### Widget Type Configurations

#### Card Widget

```typescript
fieldMapping: FieldMapping[]
// Array of field mappings with sourcePath, displayLabel, format
```

#### Table Widget

```typescript
fieldMapping: TableFieldMapping
{
  arrayPath: string;        // Path to array in API response
  columns: FieldMapping[];  // Column configurations
}
```

#### Chart Widget

```typescript
fieldMapping: ChartFieldMapping
{
  xFieldPath: string;           // Path to time/date object
  chartType: "line" | "candlestick";
  yFields: FieldMapping[];       // Y-axis field configurations
}
```

### Data Persistence

- **Storage Key**: `"widget-config"` (defined as constant)
- **Storage Method**: `localStorage` with type-safe utilities
- **Data Structure**:
  ```typescript
  {
    totalWidgets: number;
    widgets: Widget[];
  }
  ```

### API Integration

The application supports any REST API that returns JSON:

1. **API Testing**: Built-in API connection tester
2. **Error Handling**: Comprehensive error messages
3. **Rate Limiting**: Configurable refresh intervals to manage API limits
4. **Headers Support**: Custom headers for authenticated APIs

**Example APIs Used**:

- Alpha Vantage (Stock data, Forex, Crypto)
- Any REST API with JSON response

## 📊 Widget Types in Detail

### Card Widget

- **Use Case**: Display key metrics, watchlist items, single data points
- **Features**:
  - Multiple field display
  - Custom formatting per field
  - Clean, scannable layout

### Table Widget

- **Use Case**: Stock lists, market data, tabular financial data
- **Features**:
  - Sortable columns
  - Search functionality
  - Custom column widths

### Chart Widget

- **Use Case**: Price trends, performance over time, OHLC data
- **Features**:
  - Interactive tooltips
  - Zoom and pan
  - Multiple series support
  - Volume indicators (for candlestick)
