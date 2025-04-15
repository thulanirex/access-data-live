import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFraudAnalytics } from '@/hooks/useFraudAnalytics';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { DateRange } from "react-day-picker";
import FraudMetricsCards from './FraudMetricsCards';
import FraudTransactionBarChart from './FraudTransactionBarChart';
import FraudDistributionPieChart from './FraudDistributionPieChart';
import FraudCustomerTable from './FraudCustomerTable';
import FraudFlagsTable from './FraudFlagsTable';
import FraudAmountTrendChart from './FraudAmountTrendChart';
import FraudTopCustomersTable from './FraudTopCustomersTable';
import FraudCustomerHeatmap from './FraudCustomerHeatmap';
import FraudDataValidation from './FraudDataValidation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

const FraudAnalyticsTab: React.FC = () => {
    // Initialize with current date
    const today = new Date();
    const [date, setDate] = useState<DateRange | undefined>({
        from: today,
        to: today
    });
    const [customerFilter, setCustomerFilter] = useState('');
    const [highFrequencyThreshold, setHighFrequencyThreshold] = useState(5);
    const [thresholdAmount, setThresholdAmount] = useState(95000);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const formatApiDate = (date: Date) => format(date, 'yyyy-MM-dd');
    
    const { 
        loading, 
        error, 
        data,
        refetch 
    } = useFraudAnalytics({
        startDate: date?.from ? formatApiDate(date.from) : formatApiDate(today),
        endDate: date?.to ? formatApiDate(date.to) : formatApiDate(today),
        highFrequencyThreshold,
        thresholdAmount,
        refreshInterval: 300000 // 5 minutes
    });

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refetch();
            toast({
                title: "Data refreshed",
                description: "Fraud analytics data has been updated.",
                duration: 3000
            });
        } catch (error) {
            toast({
                title: "Refresh failed",
                description: "Failed to refresh data. Please try again.",
                variant: "destructive",
                duration: 3000
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        // Only fetch data on initial load, not on every date change
        // This prevents infinite refresh loops
    }, []);

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading fraud analytics data: {error.message}
                <Button 
                    variant="outline" 
                    className="ml-4" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Retry
                </Button>
            </div>
        );
    }

    // Filter data based on customer search
    const filteredFlags = customerFilter 
        ? data.flags.filter(flag => 
            flag.customerName.toLowerCase().includes(customerFilter.toLowerCase()) ||
            flag.customerId.toLowerCase().includes(customerFilter.toLowerCase())
          )
        : data.flags;

    const filteredCustomerActivity = customerFilter
        ? data.customerActivity.filter(customer => 
            customer.customerName.toLowerCase().includes(customerFilter.toLowerCase()) ||
            customer.customerId.toLowerCase().includes(customerFilter.toLowerCase())
          )
        : data.customerActivity;

    // Group flags by type for summary
    const flagsByType = data.flags.reduce((acc: {[key: string]: number}, flag) => {
        const type = flag.flagType;
        if (!acc[type]) acc[type] = 0;
        acc[type]++;
        return acc;
    }, {});

    return (
        <div className="space-y-4">
            {/* Date Range Picker and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        Showing data for: {date?.from && format(date.from, 'dd MMM yyyy')}
                        {date?.to && date.to !== date.from && ` to ${format(date.to, 'dd MMM yyyy')}`}
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh}
                        disabled={isRefreshing || loading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search customer..."
                            className="pl-8"
                            value={customerFilter}
                            onChange={(e) => setCustomerFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <DateRangePicker 
                            date={date}
                            onDateChange={setDate}
                        />
                        <Button 
                            onClick={handleRefresh} 
                            variant="default"
                            disabled={isRefreshing || loading}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            <FraudMetricsCards 
                loading={loading}
                totalFlags={data.flags.length}
                highRiskFlags={data.flags.filter(f => f.severity === 'HIGH').length}
                uniqueCustomersWithFlags={new Set(data.flags.map(f => f.customerId)).size}
                totalTransactions={data.transactions.length}
            />

            {/* Flag Type Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {Object.entries(flagsByType).map(([type, count]) => {
                    let label = '';
                    let color = '';
                    
                    switch(type) {
                        case 'DR_CR_SAME_INTERVAL':
                            label = 'DR/CR Reversals';
                            color = 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300';
                            break;
                        case 'HIGH_FREQUENCY':
                            label = 'High Frequency';
                            color = 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
                            break;
                        case 'THRESHOLD_AVOIDANCE':
                            label = 'Threshold Avoidance';
                            color = 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
                            break;
                        case 'UNUSUAL_RATIO':
                            label = 'Unusual DR/CR Ratio';
                            color = 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300';
                            break;
                        case 'VOLUME_SPIKE':
                            label = 'Volume Spike';
                            color = 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300';
                            break;
                        case 'REPEATED_AMOUNTS':
                            label = 'Repeated Amounts';
                            color = 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
                            break;
                        default:
                            label = type;
                            color = 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300';
                    }
                    
                    return (
                        <Card key={type} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className={`flex items-center p-4 ${color}`}>
                                    <AlertTriangle className="h-5 w-5 mr-2" />
                                    <span className="font-medium">{label}</span>
                                    <span className="ml-auto font-bold">{count}</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="flags">Suspicious Activities</TabsTrigger>
                    <TabsTrigger value="customers">Customer Analysis</TabsTrigger>
                    <TabsTrigger value="heatmap">Activity Heatmap</TabsTrigger>
                    <TabsTrigger value="validation">Data Validation</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* Transaction Volume Chart */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Transaction Volume by Time Interval</CardTitle>
                                <CardDescription>
                                    Transaction counts and amounts in 30-minute intervals
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                                ) : (
                                    <FraudTransactionBarChart data={data.transactionsByInterval} />
                                )}
                            </CardContent>
                        </Card>

                        {/* Debit/Credit Distribution */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Debit vs Credit Distribution</CardTitle>
                                <CardDescription>
                                    Comparison of debit and credit transactions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                                ) : (
                                    <FraudDistributionPieChart data={data.drCrDistribution} />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Amount Trend Line Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction Amount Trends</CardTitle>
                            <CardDescription>
                                Monitor transaction volume spikes over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                            ) : (
                                <FraudAmountTrendChart data={data.amountTrends} />
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        {/* Flagged Activities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Flagged Activities</CardTitle>
                                <CardDescription>
                                    Latest transactions flagged for potential fraud patterns
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                                ) : (
                                    <FraudFlagsTable data={filteredFlags.slice(0, 5)} />
                                )}
                            </CardContent>
                        </Card>

                        {/* Top Customers by Volume */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Customers by Volume</CardTitle>
                                <CardDescription>
                                    Customers with highest transaction amounts
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                                ) : (
                                    <FraudTopCustomersTable data={data.top10CustomersByVolume} />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="flags">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Flagged Suspicious Activities</CardTitle>
                            <CardDescription>
                                Comprehensive list of all transactions flagged for potential fraud patterns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-[600px] w-full animate-pulse rounded-md bg-muted" />
                            ) : (
                                <FraudFlagsTable data={filteredFlags} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="customers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Activity Analysis</CardTitle>
                            <CardDescription>
                                Detailed analysis of customer transaction patterns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-[600px] w-full animate-pulse rounded-md bg-muted" />
                            ) : (
                                <FraudCustomerTable data={filteredCustomerActivity} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="heatmap">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Activity Heatmap</CardTitle>
                            <CardDescription>
                                Visualize customer transaction patterns across time intervals
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-[600px] w-full animate-pulse rounded-md bg-muted" />
                            ) : (
                                <FraudCustomerHeatmap data={data.customerHeatmapData} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="validation">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Validation</CardTitle>
                            <CardDescription>
                                Validate data quality and reliability for fraud detection
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-[600px] w-full animate-pulse rounded-md bg-muted" />
                            ) : (
                                <FraudDataValidation 
                                    data={data.transactions} 
                                    onRefresh={handleRefresh}
                                    isRefreshing={isRefreshing}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    {/* Advanced Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detection Parameters</CardTitle>
                            <CardDescription>
                                Adjust fraud detection thresholds
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="frequency-threshold" className="text-sm font-medium">
                                        High Frequency Threshold (transactions in 30 min)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="frequency-threshold"
                                            type="number"
                                            min={1}
                                            value={highFrequencyThreshold}
                                            onChange={(e) => setHighFrequencyThreshold(parseInt(e.target.value) || 5)}
                                        />
                                        <Button onClick={() => refetch()}>Apply</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="amount-threshold" className="text-sm font-medium">
                                        Threshold Avoidance Amount
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="amount-threshold"
                                            type="number"
                                            min={1000}
                                            value={thresholdAmount}
                                            onChange={(e) => setThresholdAmount(parseInt(e.target.value) || 95000)}
                                        />
                                        <Button onClick={() => refetch()}>Apply</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FraudAnalyticsTab;
