// src/pages/dashboard/components/accesspay/AccessPayTab.tsx
import { Card } from "@/components/ui/card";
import { useAccessPayAnalytics } from "@/hooks/useAccessPayAnalytics";
import { Loader2 } from "lucide-react";
import AccessPayMetricsCards from "./AccessPayMetricsCards";
import AccessPayServiceChart from "./AccessPayServiceChart";

export default function AccessPayTab() {
    const { data, isLoading, error } = useAccessPayAnalytics();

    if (isLoading) {
        return (
            <div className="flex h-[200px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[200px] w-full items-center justify-center text-destructive">
                <p className="text-sm">Failed to load Access Pay data</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Access Pay Analytics</h2>
                    <p className="text-muted-foreground">
                        Monitor Access Pay transactions and performance metrics
                    </p>
                </div>
            </div>

            <AccessPayMetricsCards data={data.metrics} />
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card className="col-span-1 md:col-span-2">
                    <AccessPayServiceChart data={data.serviceData} />
                </Card>
                
                {/* Summary section */}
                <Card className="col-span-1 p-6">
                    <h3 className="font-semibold mb-4">Transaction Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Volume</span>
                            <span className="font-medium">{data.metrics.totalTransactions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Success Rate</span>
                            <span className={`font-medium ${
                                data.metrics.successRate >= 90 
                                    ? 'text-emerald-600' 
                                    : data.metrics.successRate >= 70 
                                        ? 'text-emerald-500' 
                                        : 'text-red-600'
                            }`}>
                                {data.metrics.successRate.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Status breakdown */}
                <Card className="col-span-1 p-6">
                    <h3 className="font-semibold mb-4">Status Breakdown</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Successful</span>
                            <span className="font-medium text-emerald-600">
                                {data.metrics.successfulTransactions.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Failed</span>
                            <span className="font-medium text-red-600">
                                {data.metrics.failedTransactions.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}