// src/pages/dashboard/components/accesspay/AccessPayMetricsCards.tsx
import { Card } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, ActivityIcon, CheckCircleIcon, XCircleIcon, PercentIcon } from "lucide-react";

interface AccessPayMetricsCardsProps {
    data: {
        totalTransactions: number;
        successfulTransactions: number;
        failedTransactions: number;
        successRate: number;
    };
}

export default function AccessPayMetricsCards({ data }: AccessPayMetricsCardsProps) {
    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
            <Card className="p-6 relative overflow-hidden">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <ActivityIcon className="w-4 h-4" />
                        Total Transactions
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                        {data.totalTransactions.toLocaleString()}
                    </span>
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-10">
                    <ActivityIcon className="w-12 h-12" />
                </div>
            </Card>

            <Card className="p-6 relative overflow-hidden">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <PercentIcon className="w-4 h-4" />
                        Success Rate
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold tabular-nums ${
                            data.successRate >= 90 
                                ? 'text-emerald-600' 
                                : data.successRate >= 70 
                                    ? 'text-emerald-500' 
                                    : 'text-red-600'
                        }`}>
                            {data.successRate.toFixed(1)}%
                        </span>
                        {data.successRate >= 90 ? (
                            <ArrowUpIcon className="w-4 h-4 text-emerald-600" />
                        ) : (
                            <ArrowDownIcon className="w-4 h-4 text-red-600" />
                        )}
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-10">
                    <PercentIcon className="w-12 h-12" />
                </div>
            </Card>

            <Card className="p-6 relative overflow-hidden">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4" />
                        Successful
                    </span>
                    <span className="text-2xl font-bold tabular-nums text-emerald-600">
                        {data.successfulTransactions.toLocaleString()}
                    </span>
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-10">
                    <CheckCircleIcon className="w-12 h-12" />
                </div>
            </Card>

            <Card className="p-6 relative overflow-hidden">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <XCircleIcon className="w-4 h-4" />
                        Failed
                    </span>
                    <span className="text-2xl font-bold tabular-nums text-red-600">
                        {data.failedTransactions.toLocaleString()}
                    </span>
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-10">
                    <XCircleIcon className="w-12 h-12" />
                </div>
            </Card>
        </div>
    );
}