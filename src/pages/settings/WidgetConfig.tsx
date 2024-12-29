// @ts-nocheck
import React from 'react';
import { ChartWidget, WidgetType, ChartType } from '@/lib/types/dashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface WidgetConfigProps {
  onSave: (widget: ChartWidget) => void;
  initialData?: ChartWidget;
}

export default function WidgetConfig({ onSave, initialData }: WidgetConfigProps) {
  const [widgetType, setWidgetType] = React.useState<WidgetType>(initialData?.type || 'chart');
  const [chartType, setChartType] = React.useState<ChartType>(
    (initialData as ChartWidget)?.chartConfig?.chartType || 'line'
  );
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [description, setDescription] = React.useState(initialData?.description || '');

  const handleSave = () => {
    const widget: ChartWidget = {
      id: initialData?.id || crypto.randomUUID(),
      type: 'chart',
      title,
      description,
      dataConfig: {
        source: 'static',
        refreshInterval: 60,
      },
      position: initialData?.position || {
        x: 0,
        y: 0,
        width: 6,
        height: 4,
      },
      chartConfig: {
        chartType,
        xAxis: {
          field: 'timestamp',
          label: 'Time',
          type: 'datetime',
        },
        yAxis: {
          field: 'value',
          label: 'Value',
        },
        showGrid: true,
        showLegend: true,
      },
    };

    onSave(widget);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Configuration</CardTitle>
        <CardDescription>
          Configure your dashboard widget settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter widget title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter widget description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="widget-type">Widget Type</Label>
          <Select
            value={widgetType}
            onValueChange={(value: WidgetType) => setWidgetType(value)}
          >
            <SelectTrigger id="widget-type">
              <SelectValue placeholder="Select widget type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chart">Chart</SelectItem>
              <SelectItem value="metric">Metric</SelectItem>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="list">List</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {widgetType === 'chart' && (
          <div className="space-y-2">
            <Label htmlFor="chart-type">Chart Type</Label>
            <Select
              value={chartType}
              onValueChange={(value: ChartType) => setChartType(value)}
            >
              <SelectTrigger id="chart-type">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="scatter">Scatter Plot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Widget
        </Button>
      </CardContent>
    </Card>
  );
}
