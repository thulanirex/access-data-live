import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from '@/hooks/useAnalytics';
import TengaTransactionTable from './TengaTransactionTable';
import TengaSuccessRateChart from './TengaSuccessRateChart';
import TengaMetricsCards from './TengaMetricsCards';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { DateRange } from "react-day-picker"

const TengaTab: React.FC = () => {
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
        channel: 'TENGA',
        refreshInterval: 300000 // 5 minutes
    });

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading Tenga data: {error.message}
            </div>
        );
    }

    const tengaMetrics = channelMetrics.find(m => m.channel === 'TENGA') || {
        channel: 'TENGA',
        successCount: 0,
        failureCount: 0,
        totalTransactions: 0,
        successRate: 0
    };

    const tengaTransactions = transactionMetrics.filter(t => 
        t.type.toLowerCase().includes('wallet')
    );

    return (
        <div className="space-y-4">
            {/* Date Range Picker */}
            <div className="flex justify-between items-center mb-4">
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
                            Detailed breakdown of wallet transaction performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                        ) : (
                            <TengaTransactionTable data={transactionMetrics} />
                        )}
                    </CardContent>
                </Card>

                <div className="col-span-3">
                    <TengaMetricsCards 
                        loading={loading}
                        metrics={tengaMetrics}
                        transactions={transactionMetrics}
                    />
                    {/* Success Rate Chart */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Success Rate Overview</CardTitle>
                            <CardDescription>
                                Overall success vs failure rate for wallet transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-[300px] w-full animate-pulse rounded-md bg-muted" />
                            ) : (
                                <TengaSuccessRateChart data={transactionMetrics} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Transaction Types Chart */}
            </div>
        </div>
    );
};

export default TengaTab;
