import { useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import numeral from 'numeral'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Widget as WidgetType } from '@/lib/types/dashboard'

// Mock data for demonstration
const mockData = {
  chart: Array.from({ length: 7 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    value: Math.floor(Math.random() * 100),
  })),
  metric: {
    current: Math.floor(Math.random() * 1000),
    previous: Math.floor(Math.random() * 1000),
  },
  table: Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 100),
    status: Math.random() > 0.5 ? 'Active' : 'Inactive',
  })),
}

interface WidgetProps {
  widget: WidgetType
  className?: string
}

export function Widget({ widget, className = '' }: WidgetProps) {
  const renderChart = useMemo(() => {
    if (widget.type !== 'chart') return null

    switch (widget.chartConfig.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.chart}>
              {widget.chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
              />
              {widget.chartConfig.showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.chart}>
              {widget.chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
              />
              {widget.chartConfig.showLegend && <Legend />}
              <Bar
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData.chart}>
              {widget.chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
              />
              {widget.chartConfig.showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
              />
              {widget.chartConfig.showLegend && <Legend />}
              <Pie
                data={mockData.chart}
                dataKey="value"
                nameKey="timestamp"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }, [widget])

  const renderTable = useMemo(() => {
    if (widget.type !== 'table') return null

    const data = widget.tableConfig.pagination?.enabled
      ? mockData.table.slice(0, widget.tableConfig.pagination.pageSize)
      : mockData.table

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {widget.tableConfig.columns.map((column) => (
              <TableHead
                key={column.field}
                style={{ width: column.width }}
                className="text-center"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {widget.tableConfig.columns.map((column) => (
                <TableCell key={column.field} className="text-center">
                  {row[column.field as keyof typeof row]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }, [widget])

  const renderMetric = useMemo(() => {
    if (widget.type !== 'metric') return null

    const { current, previous } = mockData.metric
    const percentageChange = previous !== 0 
      ? ((current - previous) / previous * 100).toFixed(1) 
      : 'N/A'

    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="text-3xl font-bold">
          {numeral(current).format('0,0')}
        </div>
        <div 
          className={`text-sm ${
            current > previous 
              ? 'text-green-600' 
              : current < previous 
                ? 'text-red-600' 
                : 'text-gray-600'
          }`}
        >
          {percentageChange}% from previous period
        </div>
      </div>
    )
  }, [widget])

  return (
    <Card
      className={className}
      style={{
        backgroundColor: widget.styling?.backgroundColor,
        color: widget.styling?.textColor,
      }}
    >
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
        {widget.description && (
          <CardDescription>{widget.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {widget.type === 'chart' && renderChart}
        {widget.type === 'metric' && renderMetric}
        {widget.type === 'table' && renderTable}
      </CardContent>
    </Card>
  )
}