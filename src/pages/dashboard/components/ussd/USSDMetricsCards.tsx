import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface USSDMetricsCardsProps {
  data: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    successRate: number;
  };
}

export default function USSDMetricsCards({ data }: USSDMetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
            <MinusIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline space-x-3">
            <h3 className="text-2xl font-semibold">{data.totalTransactions.toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">transactions</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Successful</p>
            <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-3">
            <h3 className="text-2xl font-semibold text-emerald-600">
              {data.successfulTransactions.toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">transactions</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Failed</p>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex items-baseline space-x-3">
            <h3 className="text-2xl font-semibold text-red-600">
              {data.failedTransactions.toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">transactions</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
            {data.successRate >= 90 ? (
              <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
            ) : data.successRate >= 70 ? (
              <MinusIcon className="h-4 w-4 text-yellow-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="flex items-baseline space-x-3">
            <h3 className={`text-2xl font-semibold ${
              data.successRate >= 90 
                ? 'text-emerald-600' 
                : data.successRate >= 70 
                  ? 'text-emerald-500' 
                  : 'text-red-600'
            }`}>
              {data.successRate.toFixed(1)}%
            </h3>
            <p className="text-sm text-muted-foreground">success rate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
