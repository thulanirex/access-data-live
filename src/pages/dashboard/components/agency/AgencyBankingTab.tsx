import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { DateRange } from "react-day-picker";
import { useAgencyBankingAnalytics } from '@/hooks/useAgencyBankingAnalytics';
import AgencyBankingTransactionTable from './AgencyBankingTransactionTable';
import AgencyBankingMetricsCards from './AgencyBankingMetricsCards';
import AgencyBankingSuccessRateChart from './AgencyBankingSuccessRateChart';
import AgencyBankingTransactionTypesChart from './AgencyBankingTransactionTypesChart';

const AgencyBankingTab: React.FC = () => {
    const today = new Date();
    const [date, setDate] = useState<DateRange | undefined>({
        from: today,
        to: today
    });
    
    const formatApiDate = (date: Date) => format(date, 'dd-MMM-yyyy').toUpperCase();
    
    const { 
        data,
        isLoading,
        error
    } = useAgencyBankingAnalytics({
        startDate: date?.from ? formatApiDate(date.from) : formatApiDate(today),
        endDate: date?.to ? formatApiDate(date.to) : formatApiDate(today)
    });

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading Agency Banking data: {error.message}
            </div>
        );
    }

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
                            Detailed breakdown of agency banking transactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                        ) : (
                            <AgencyBankingTransactionTable data={data?.detailReport || []} />
                        )}
                    </CardContent>
                </Card>

                <div className="col-span-3">
                    <AgencyBankingMetricsCards 
                        loading={isLoading}
                        data={data}
                    />
                    {/* Success Rate Chart */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Success Rate Overview</CardTitle>
                            <CardDescription>
                                Overall success vs failure rate for agency banking
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-[300px] w-full animate-pulse rounded-md bg-muted" />
                            ) : (
                                <AgencyBankingSuccessRateChart data={data} />
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
                        {isLoading ? (
                            <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                        ) : (
                            <AgencyBankingTransactionTypesChart data={data?.detailReport || []} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AgencyBankingTab;