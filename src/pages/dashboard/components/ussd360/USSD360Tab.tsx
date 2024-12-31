import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { DateRange } from "react-day-picker";
import { useUSSD360Analytics } from '@/hooks/useUSSD360Analytics';
import USSD360TransactionTable from './USSD360TransactionTable';
import USSD360MetricsCards from './USSD360MetricsCards';
import USSD360SuccessRateChart from './USSD360SuccessRateChart';
import USSD360TransactionTypesChart from './USSD360TransactionTypesChart';

const USSD360Tab: React.FC = () => {
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
    } = useUSSD360Analytics({
        startDate: date?.from ? formatApiDate(date.from) : formatApiDate(today),
        endDate: date?.to ? formatApiDate(date.to) : formatApiDate(today)
    });

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading USSD *360# data: {error.message}
            </div>
        );
    }

    return (
        <div className="space-y-4">
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
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Transaction Analysis</CardTitle>
                        <CardDescription>
                            Detailed breakdown of USSD *360# transactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                        ) : (
                            <USSD360TransactionTable data={data?.detailReport || []} />
                        )}
                    </CardContent>
                </Card>

                <div className="col-span-3">
                    <USSD360MetricsCards 
                        loading={isLoading}
                        data={data}
                    />
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Success Rate Overview</CardTitle>
                            <CardDescription>
                                Overall success vs failure rate for USSD *360#
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-[300px] w-full animate-pulse rounded-md bg-muted" />
                            ) : (
                                <USSD360SuccessRateChart data={data} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Transaction Types Performance</CardTitle>
                        <CardDescription>Success rate by transaction type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-[400px] w-full animate-pulse rounded-md bg-muted" />
                        ) : (
                            <USSD360TransactionTypesChart data={data?.detailReport || []} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default USSD360Tab;