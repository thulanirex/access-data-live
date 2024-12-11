// Widget Types
export type WidgetType = 'chart' | 'metric' | 'table' | 'list' | 'custom'
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter'
export type DataSourceType = 'channel' | 'api' | 'static' | 'workflow'

// Data Configuration
export interface DataConfig {
  source: DataSourceType
  channelId?: string
  apiEndpoint?: string
  workflowId?: string
  refreshInterval?: number // in seconds
  query?: string
  filters?: Record<string, any>
  mapping?: Record<string, string>
}

// Widget Base Configuration
export interface WidgetBase {
  id: string
  type: WidgetType
  title: string
  description?: string
  dataConfig: DataConfig
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  styling?: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
    padding?: number
  }
}

// Chart Widget
export interface ChartWidget extends WidgetBase {
  type: 'chart'
  chartConfig: {
    chartType: ChartType
    xAxis: {
      field: string
      label: string
      type: 'datetime' | 'category' | 'number'
    }
    yAxis: {
      field: string
      label: string
      type: 'number'
    }
    series: Array<{
      name: string
      field: string
      color?: string
    }>
    stacked?: boolean
    showLegend?: boolean
    showGrid?: boolean
  }
}

// Metric Widget
export interface MetricWidget extends WidgetBase {
  type: 'metric'
  metricConfig: {
    format: string
    prefix?: string
    suffix?: string
    thresholds?: {
      warning: number
      critical: number
    }
    trend?: {
      show: boolean
      period: 'hour' | 'day' | 'week' | 'month'
    }
  }
}

// Table Widget
export interface TableWidget extends WidgetBase {
  type: 'table'
  tableConfig: {
    columns: Array<{
      field: string
      header: string
      width?: number
      sortable?: boolean
      filterable?: boolean
      format?: string
    }>
    pagination?: {
      enabled: boolean
      pageSize: number
    }
    actions?: Array<{
      label: string
      icon?: string
      handler: string // name of the function to handle the action
    }>
  }
}

// Custom Widget
export interface CustomWidget extends WidgetBase {
  type: 'custom'
  componentName: string // name of the React component to render
  props?: Record<string, any>
}

// Union type for all widgets
export type Widget = ChartWidget | MetricWidget | TableWidget | CustomWidget

// Tab Configuration
export interface DashboardTab {
  id: string
  title: string
  icon?: string
  widgets: Widget[]
  layout?: {
    columns: number
    gap: number
    padding: number
  }
}

// Channel Configuration
export interface ChannelConfig {
  id: string
  name: string
  description?: string
  source: {
    type: 'database' | 'api' | 'workflow'
    config: Record<string, any>
  }
  metrics: Array<{
    id: string
    name: string
    query: string
    format: string
    refreshInterval: number
  }>
  alerts?: Array<{
    id: string
    name: string
    condition: string
    threshold: number
    severity: 'info' | 'warning' | 'critical'
    notification: {
      type: 'email' | 'slack' | 'webhook'
      config: Record<string, any>
    }
  }>
}

// Complete Dashboard Configuration
export interface DashboardConfig {
  id: string
  name: string
  description?: string
  owner: string
  createdAt: Date
  updatedAt: Date
  tabs: DashboardTab[]
  channels: ChannelConfig[]
  sharing?: {
    public: boolean
    users: string[]
    groups: string[]
  }
  theme?: {
    primary: string
    secondary: string
    background: string
    text: string
  }
}