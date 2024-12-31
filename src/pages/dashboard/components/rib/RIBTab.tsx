// src/pages/dashboard/components/rib/RIBTab.tsx

import { Card } from '@/components/ui/card'
import { useRIBAnalytics } from '@/hooks/useRIBAnalytics'
import { format } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowDownIcon, ArrowUpIcon, Activity } from 'lucide-react'

const COLORS = ['#22c55e', '#ef4444']

export function RIBTab() {
  const today = format(new Date(), 'dd-MMM-yyyy').toUpperCase()
  const { data, isLoading, error } = useRIBAnalytics({
    startDate: today,
    endDate: today
  })

  if (isLoading) {
    return <Skeleton className="w-full h-[500px]" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-destructive">Failed to load Retail Internet Banking data</p>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const pieData = [
    { name: 'Success', value: data.success },
    { name: 'Failed', value: data.failed }
  ]

  // Transform data for charts
  const serviceData = data.detailReport.map(service => ({
    name: service.TRANSACTION_TYPE,
    success: service.SUCCESSFUL_TRANSACTIONS,
    failed: service.FAILED_TRANSACTIONS,
    total: service.TOTAL_TRANSACTIONS
  }))

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Total Transactions</span>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="text-3xl font-bold">{data.total.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-green-600">
                {data.percentSuccess.toFixed(1)}%
              </span>
              <ArrowUpIcon className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-muted-foreground">
              {data.success.toLocaleString()} transactions
            </span>
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Failure Rate</span>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-red-600">
                {data.percentFailed.toFixed(1)}%
              </span>
              <ArrowDownIcon className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-sm text-muted-foreground">
              {data.failed.toLocaleString()} transactions
            </span>
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Service Types</span>
            <span className="text-3xl font-bold">{data.detailReport.length}</span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Transaction Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Service Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="success" stackId="a" fill="#22c55e" name="Success" />
                <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 bg-muted/50">Service Type</th>
                  <th className="text-right p-3 bg-muted/50">Total</th>
                  <th className="text-right p-3 bg-muted/50">Success</th>
                  <th className="text-right p-3 bg-muted/50">Failed</th>
                  <th className="text-right p-3 bg-muted/50">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.detailReport.map((service) => (
                  <tr key={service.TRANSACTION_TYPE} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3">{service.TRANSACTION_TYPE}</td>
                    <td className="text-right p-3 font-medium">{service.TOTAL_TRANSACTIONS}</td>
                    <td className="text-right p-3 text-green-600">{service.SUCCESSFUL_TRANSACTIONS}</td>
                    <td className="text-right p-3 text-red-600">{service.FAILED_TRANSACTIONS}</td>
                    <td className="text-right p-3 font-medium">
                      {((service.SUCCESSFUL_TRANSACTIONS / service.TOTAL_TRANSACTIONS) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}