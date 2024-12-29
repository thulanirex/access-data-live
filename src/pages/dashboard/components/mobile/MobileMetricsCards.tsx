import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChannelMetrics, TransactionTypeMetrics } from "@/types/api"

interface MobileMetricsCardsProps {
    loading: boolean;
    metrics: ChannelMetrics;
    transactions: TransactionTypeMetrics[];
}

export default function MobileMetricsCards({ loading, metrics, transactions }: MobileMetricsCardsProps) {
    // Aggregate mobile banking transactions
    const mobileMetrics = transactions?.reduce((acc, curr) => {
        acc.total += curr.total;
        acc.success += curr.successCount;
        acc.failed += curr.failureCount;
        return acc;
    }, { total: 0, success: 0, failed: 0 });

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{mobileMetrics.total.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Successful</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {mobileMetrics.success.toLocaleString()}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                        {mobileMetrics.failed.toLocaleString()}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {((mobileMetrics.success / mobileMetrics.total) * 100).toFixed(1)}%
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
