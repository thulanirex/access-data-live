import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChannelMetrics, TransactionTypeMetrics } from '@/types/api';
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

interface TengaMetricsCardsProps {
    loading: boolean;
    metrics: ChannelMetrics;
    transactions?: TransactionTypeMetrics[];
}

const TengaMetricsCards: React.FC<TengaMetricsCardsProps> = ({ loading, metrics, transactions }) => {
    // Filter and aggregate wallet transactions
    const walletMetrics = transactions?.filter(t => t.type.toLowerCase())
        .reduce((acc, curr) => {
            acc.total += curr.total;
            acc.success += curr.successCount;
            acc.failure += curr.failureCount;
            return acc;
        }, { total: 0, success: 0, failure: 0 }) || { total: 0, success: 0, failure: 0 };

    const successRate = walletMetrics.total > 0 
        ? ((walletMetrics.success / walletMetrics.total) * 100).toFixed(1)
        : '0';

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{walletMetrics.total.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Successful Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                        {walletMetrics.success.toLocaleString()}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Failed Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-500">
                        {walletMetrics.failure.toLocaleString()}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Success Rate
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{successRate}%</div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TengaMetricsCards;
