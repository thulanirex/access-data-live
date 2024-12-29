import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from '@/hooks/useAnalytics';
import MobileTransactionTable from './MobileTransactionTable';
import MobileTransactionTypesChart from './MobileTransactionTypesChart';
import MobileSuccessRateChart from './MobileSuccessRateChart';
import MobileMetricsCards from './MobileMetricsCards';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { DateRange } from "react-day-picker"
import { format } from 'date-fns';
import { useState } from "react";

const MobileTab: React.FC = () => {
    // Initialize with current date
    const today = new Date();
    const [date, setDate] = useState<DateRange | undefined>({
        from: today,
        to: today
    });
    
    const formatApiDate = (date: Date) => format(date, 'dd-MMM-yyyy').toUpperCase();
    
    const { 
        loading, 
        error, 
        transactionMetrics,
        channelMetrics,
        refetch 
    } = useAnalytics({
        startDate: date?.from ? formatApiDate(date.from) : formatApiDate(today),
        endDate: date?.to ? formatApiDate(date.to) : formatApiDate(today),
        channel: 'MOBILE', // This will trigger Mobile Banking data filtering
        refreshInterval: 300000 // 5 minutes
    });

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading Mobile Banking data: {error.message}
            </div>
        );
    }

    const mobileMetrics = channelMetrics.find(m => m.channel === 'Mobile Banking') || {
        channel: 'Mobile Banking',
        successCount: 0,
        failureCount: 0,
        totalTransactions: 0,
        successRate: 0
    };

    return (
        <div className="space-y-4">
            {/* Date Range Picker */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Showing data for: {date?.from && formatApiDate(date.from)}
                    {date?.to && date.to !== date.from && ` to ${formatApiDate(date.to)}`}
                </div>
                <DateRangePicker 
                    date={date}
                    onDateChange={setDate}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Transaction Analysis Table */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Transaction Analysis</CardTitle>
                        <CardDescription>
                            Detailed breakdown of mobile banking transaction performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                        ) : (
                            <MobileTransactionTable data={transactionMetrics} />
                        )}
                    </CardContent>
                </Card>

                <div className="col-span-3">
                    <MobileMetricsCards 
                        loading={loading}
                        metrics={mobileMetrics}
                        transactions={transactionMetrics}
                    />
                    {/* Success Rate Chart */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Success Rate Overview</CardTitle>
                            <CardDescription>
                                Overall success vs failure rate for mobile banking transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-[300px] w-full animate-pulse rounded-md bg-muted" />
                            ) : (
                                <MobileSuccessRateChart data={transactionMetrics} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Transaction Types Chart */}
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Transaction Types Performance</CardTitle>
                        <CardDescription>Success rate by transaction type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                        ) : (
                            <MobileTransactionTypesChart data={transactionMetrics} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MobileTab;
