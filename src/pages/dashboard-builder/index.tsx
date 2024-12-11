import { useState } from 'react'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {
  IconChartBar,
  IconTable,
  IconNumber,
  IconSettings,
  IconDeviceFloppy,
} from '@tabler/icons-react'
import { Layout as CustomLayout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import type {
  Widget,
  DashboardConfig,
  ChartWidget,
  MetricWidget,
  TableWidget,
} from '@/lib/types/dashboard'
import { Widget as WidgetComponent } from '@/components/dashboard/Widget'
import { WidgetConfig } from '@/components/dashboard/WidgetConfig'

const ResponsiveGridLayout = WidthProvider(Responsive)

// Mock data for demonstration
const initialDashboard: DashboardConfig = {
  id: '1',
  name: 'My Dashboard',
  description: 'A sample dashboard',
  owner: 'user1',
  createdAt: new Date(),
  updatedAt: new Date(),
  tabs: [
    {
      id: 'tab1',
      title: 'Overview',
      widgets: [],
      layout: {
        columns: 12,
        gap: 16,
        padding: 16,
      },
    },
    {
      id: 'tab2',
      title: 'Details',
      widgets: [],
      layout: {
        columns: 12,
        gap: 16,
        padding: 16,
      },
    },
  ],
  channels: [],
}

export default function DashboardBuilder() {
  const [dashboard, setDashboard] = useState<DashboardConfig>(initialDashboard)
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)
  const [configOpen, setConfigOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(dashboard.tabs[0].id)

  const activeTabContent = dashboard.tabs.find((tab) => tab.id === activeTab)!

  const handleAddWidget = (type: Widget['type']) => {
    const newWidget: Partial<Widget> = {
      id: `widget-${Date.now()}`,
      type,
      title: `New ${type} widget`,
      position: {
        x: 0,
        y: 0,
        width: 6,
        height: 4,
      },
      dataConfig: {
        source: 'channel',
        refreshInterval: 30,
      },
    }

    switch (type) {
      case 'chart':
        ;(newWidget as ChartWidget).chartConfig = {
          chartType: 'line',
          xAxis: {
            field: 'timestamp',
            label: 'Time',
            type: 'datetime',
          },
          yAxis: {
            field: 'value',
            label: 'Value',
            type: 'number',
          },
          series: [
            {
              name: 'Series 1',
              field: 'value',
            },
          ],
          showLegend: true,
          showGrid: true,
        }
        break
      case 'metric':
        ;(newWidget as MetricWidget).metricConfig = {
          format: '0,0',
          trend: {
            show: true,
            period: 'day',
          },
        }
        break
      case 'table':
        ;(newWidget as TableWidget).tableConfig = {
          columns: [
            {
              field: 'id',
              header: 'ID',
              width: 100,
            },
            {
              field: 'name',
              header: 'Name',
              width: 200,
            },
          ],
          pagination: {
            enabled: true,
            pageSize: 10,
          },
        }
        break
    }

    setDashboard((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) =>
        tab.id === activeTab
          ? { ...tab, widgets: [...tab.widgets, newWidget as Widget] }
          : tab,
      ),
    }))
  }

  const handleLayoutChange = (layout: Layout[]) => {
    setDashboard((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              widgets: tab.widgets.map((widget) => {
                const newLayout = layout.find((l) => l.i === widget.id)
                if (newLayout) {
                  return {
                    ...widget,
                    position: {
                      x: newLayout.x !== undefined ? newLayout.x : widget.position.x,
                      y: newLayout.y !== undefined ? newLayout.y : widget.position.y,
                      width: newLayout.w !== undefined ? newLayout.w : widget.position.width,
                      height: newLayout.h !== undefined ? newLayout.h : widget.position.height,
                    },
                  }
                }
                return widget
              }),
            }
          : tab,
      ),
    }))
  }

  const handleWidgetUpdate = (updatedWidget: Widget) => {
    setDashboard((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              widgets: tab.widgets.map((widget) =>
                widget.id === updatedWidget.id ? updatedWidget : widget
              ),
            }
          : tab
      ),
    }))
    setSelectedWidget(null)
  }

  const handleWidgetSelect = (widget: Widget) => {
    setSelectedWidget(widget)
    setConfigOpen(true)
  }

  return (
    <CustomLayout>
      <LayoutHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Builder</h1>
            <p className="text-muted-foreground">
              Create and customize your dashboard
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <IconDeviceFloppy className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </LayoutHeader>

      <LayoutBody>
        <div className="flex h-full">
          <div className="w-64 border-r p-4">
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold mb-2">Add Widgets</h2>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddWidget('chart')}
                  >
                    <IconChartBar className="h-4 w-4 mr-2" />
                    Chart
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddWidget('metric')}
                  >
                    <IconNumber className="h-4 w-4 mr-2" />
                    Metric
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddWidget('table')}
                  >
                    <IconTable className="h-4 w-4 mr-2" />
                    Table
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Tabs</h2>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                  orientation="vertical"
                >
                  <TabsList className="w-full">
                    {dashboard.tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="w-full justify-start"
                      >
                        {tab.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <ResponsiveGridLayout
              className="layout"
              layouts={{
                lg: activeTabContent.widgets.map((widget) => ({
                  i: widget.id,
                  x: widget.position.x,
                  y: widget.position.y,
                  w: widget.position.width ?? 1,
                  h: widget.position.height ?? 1,
                })),
                md: activeTabContent.widgets.map((widget) => ({
                  i: widget.id,
                  x: widget.position.x,
                  y: widget.position.y,
                  w: widget.position.width ?? 1,
                  h: widget.position.height ?? 1,
                })),
                sm: activeTabContent.widgets.map((widget) => ({
                  i: widget.id,
                  x: widget.position.x,
                  y: widget.position.y,
                  w: widget.position.width ?? 1,
                  h: widget.position.height ?? 1,
                })),
              }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={100}
              margin={[16, 16]}
              onLayoutChange={handleLayoutChange}
            >
              {activeTabContent.widgets.map((widget) => (
                <div key={widget.id} className="relative group">
                  <WidgetComponent widget={widget} />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleWidgetSelect(widget)}
                    >
                      <IconSettings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        </div>

        <WidgetConfig
          widget={selectedWidget}
          open={configOpen}
          onClose={() => {
            setConfigOpen(false)
            setSelectedWidget(null)
          }}
          onSave={handleWidgetUpdate}
        />
      </LayoutBody>
    </CustomLayout>
  )
}