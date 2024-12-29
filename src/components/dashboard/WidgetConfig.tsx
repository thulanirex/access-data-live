// @ts-nocheck
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import type {
  Widget,
  ChartWidget,
  MetricWidget,
  TableWidget,
} from '@/lib/types/dashboard'

const formSchema = z.object({
  type: z.enum(['chart', 'metric', 'table', 'custom']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dataConfig: z.object({
    source: z.enum(['channel', 'api', 'static', 'workflow']).min(1, 'Data source is required'),
    refreshInterval: z.number().optional(),
  }),
  styling: z.object({
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
  }).optional(),
  chartConfig: z.object({
    chartType: z.enum(['line', 'bar', 'pie', 'area', 'scatter']),
    xAxis: z.object({
      field: z.string(),
      label: z.string(),
      type: z.enum(['number', 'datetime', 'category']),
    }),
    yAxis: z.object({
      field: z.string(),
      label: z.string(),
      type: z.literal('number'),
    }),
    series: z.array(z.object({
      name: z.string(),
      field: z.string(),
      color: z.string().optional(),
    })),
    stacked: z.boolean().optional(),
    showLegend: z.boolean().optional(),
    showGrid: z.boolean().optional(),
  }).optional(),
  metricConfig: z.object({
    format: z.string(),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
    thresholds: z.object({
      warning: z.number(),
      critical: z.number(),
    }).optional(),
    trend: z.object({
      show: z.boolean(),
      period: z.enum(['hour', 'day', 'week', 'month']),
    }).optional(),
  }).optional(),
  tableConfig: z.object({
    columns: z.array(z.object({
      field: z.string().min(1, 'Field is required'),
      header: z.string().min(1, 'Header is required'),
      width: z.number().optional(),
      sortable: z.boolean().optional(),
      filterable: z.boolean().optional(),
      format: z.string().optional(),
    })).min(1, 'At least one column is required'),
    pagination: z.object({
      enabled: z.boolean(),
      pageSize: z.number(),
    }).optional(),
    actions: z.array(z.object({
      label: z.string(),
      icon: z.string().optional(),
      handler: z.string(),
    })).optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface WidgetConfigProps {
  widget: Widget | null
  open: boolean
  onClose: () => void
  onSave: (widget: Widget) => void
}

export function WidgetConfig({
  widget,
  open,
  onClose,
  onSave,
}: WidgetConfigProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'chart',
      title: '',
      description: '',
      dataConfig: {
        source: 'channel',
        refreshInterval: 30,
      },
      styling: {},
    },
  })

  useEffect(() => {
    if (widget) {
      form.reset({
        type: widget.type,
        title: widget.title,
        description: widget.description,
        dataConfig: widget.dataConfig,
        styling: widget.styling,
        ...(widget.type === 'chart' && {
          chartConfig: (widget as ChartWidget).chartConfig,
        }),
        ...(widget.type === 'metric' && {
          metricConfig: (widget as MetricWidget).metricConfig,
        }),
        ...(widget.type === 'table' && {
          tableConfig: (widget as TableWidget).tableConfig,
        }),
      })
    }
  }, [widget, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!widget) return

    const updatedWidget: Widget = {
      ...widget,
      title: values.title,
      description: values.description,
      dataConfig: values.dataConfig,
      styling: values.styling,
    }

    if (widget.type === 'chart' && values.chartConfig) {
      (updatedWidget as ChartWidget).chartConfig = values.chartConfig
    } else if (widget.type === 'metric' && values.metricConfig) {
      (updatedWidget as MetricWidget).metricConfig = values.metricConfig
    } else if (widget.type === 'table' && values.tableConfig) {
      (updatedWidget as TableWidget).tableConfig = values.tableConfig
    }

    onSave(updatedWidget)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Configure Widget</SheetTitle>
          <SheetDescription>
            Customize the widget's appearance and behavior
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="type">Type</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <FormField
                  control={form.control}
                  name="dataConfig.source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Source</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select data source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="channel">Channel</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                          <SelectItem value="static">Static</SelectItem>
                          <SelectItem value="workflow">Workflow</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataConfig.refreshInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refresh Interval (seconds)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <FormField
                  control={form.control}
                  name="styling.backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="styling.textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="type" className="space-y-4">
                {widget?.type === 'chart' && (
                  <>
                    <FormField
                      control={form.control}
                      name="chartConfig.chartType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chart Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select chart type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="line">Line</SelectItem>
                              <SelectItem value="bar">Bar</SelectItem>
                              <SelectItem value="area">Area</SelectItem>
                              <SelectItem value="pie">Pie</SelectItem>
                              <SelectItem value="scatter">Scatter</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chartConfig.showLegend"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Show Legend</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {widget?.type === 'metric' && (
                  <>
                    <FormField
                      control={form.control}
                      name="metricConfig.format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number Format</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="0,0.00" />
                          </FormControl>
                          <FormDescription>
                            Use numeral.js format pattern
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metricConfig.trend.show"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Show Trend</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {widget?.type === 'table' && (
                  <>
                    <FormField
                      control={form.control}
                      name="tableConfig.pagination.enabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Enable Pagination</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tableConfig.pagination.pageSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Size</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}