import { format } from 'date-fns'
import { useATMAnalytics } from '@/hooks/useATMAnalytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { IconCash, IconChartBar, IconCheck, IconX } from '@tabler/icons-react'
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    Legend,
    LineChart,
    Line
} from 'recharts'

export default function ATMTab() {
    const today = format(new Date(), 'dd-MMM-yyyy').toUpperCase()
    const { data, trendData, isLoading, error } = useATMAnalytics({
        startDate: today,
        endDate: today
    })

    if (isLoading) {
        return <Skeleton className="h-[200px] w-full" />
    }

    if (error) {
        return <div>Error loading ATM data</div>
    }

    if (!data || !trendData) {
        return <div>No data available</div>
    }

    const chartData = trendData.map(item => ({
        date: format(new Date(item.date.split('-').reverse().join('-')), 'MMM dd'),
        Success: parseInt(item.detailReport[0].success_transaction),
        Failed: parseInt(item.detailReport[0].failed_transactions),
        Total: parseInt(item.total),
        'Success Rate': parseFloat(item.percentSuccess)
    }));

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <IconCash className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{parseInt(data.total).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            All ATM transactions today
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        <IconChartBar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline space-x-2">
                            <div className="text-2xl font-bold">{data.percentSuccess}%</div>
                            <span className="text-sm text-green-500">↑</span>
                        </div>
                        <Progress 
                            value={parseFloat(data.percentSuccess)} 
                            className="mt-2 h-2 bg-muted"
                            indicatorClassName="bg-green-500"
                        />
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Successful Transactions</CardTitle>
                        <IconCheck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {parseInt(data.detailReport[0].success_transaction).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Completed successfully
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
                        <IconX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {parseInt(data.detailReport[0].failed_transactions).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Failed transactions today
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Transaction Volume Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area 
                                        type="monotone" 
                                        dataKey="Success" 
                                        stackId="1"
                                        stroke="#10B981" 
                                        fill="#10B981" 
                                        fillOpacity={0.6}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="Failed" 
                                        stackId="1"
                                        stroke="#EF4444" 
                                        fill="#EF4444" 
                                        fillOpacity={0.6}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Success Rate Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Line 
                                        type="monotone"
                                        dataKey="Success Rate"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Transactions Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar 
                                        dataKey="Total" 
                                        fill="#6366F1"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}