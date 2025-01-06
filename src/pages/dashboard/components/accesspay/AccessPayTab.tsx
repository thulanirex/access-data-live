import { Card } from "@/components/ui/card";
import { useAccessPayAnalytics } from "@/hooks/useAccessPayAnalytics";
import { Loader2 } from "lucide-react";
import AccessPayMetricsCards from "./AccessPayMetricsCards";
import AccessPayServiceChart from "./AccessPayServiceChart";
import AccessPayStatusChart from "./AccessPayStatusChart";

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
                <Card className="col-span-1">
                    <AccessPayServiceChart data={data.serviceData} />
                </Card>
                
                <Card className="col-span-1">
                    <AccessPayStatusChart data={data.statusData} />
                </Card>
            </div>
        </div>
    );
}