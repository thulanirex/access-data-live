import { Card } from "@/components/ui/card";
import { useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUSSDAnalytics } from "@/hooks/useUSSDAnalytics";
import USSDMetricsCards from "./USSDMetricsCards";
import USSDServiceChart from "./USSDServiceChart";
import USSDTransactionTable from "./USSDTransactionTable";
import USSDTrendsChart from "./USSDTrendsChart";
import USSDVolumeChart from "./USSDVolumeChart";
import { Loader2 } from "lucide-react";

export default function USSDTab() {
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: today,
  });

  const formatApiDate = (date: Date) => format(date, 'dd-MMM-yyyy').toUpperCase();

  const { data, isLoading, error } = useUSSDAnalytics({
    startDate: date?.from ? formatApiDate(date.from) : formatApiDate(today),
    endDate: date?.to ? formatApiDate(date.to) : formatApiDate(today),
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-2">Error loading USSD data: {error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-lg text-muted-foreground">No USSD data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">USSD *801# Analytics</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {date?.from && date?.to && (date.from !== date.to) 
                ? `Transaction data from ${formatApiDate(date.from)} to ${formatApiDate(date.to)}`
                : 'Today\'s transaction data'
              }
            </p>
          </div>
          <DateRangePicker
            date={date}
            onDateChange={setDate}
          />
        </div>

        <USSDMetricsCards data={data.metrics} />
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card className="col-span-1">
            <USSDTrendsChart data={data.timeSeriesData} />
          </Card>
          <Card className="col-span-1">
            <USSDVolumeChart data={data.timeSeriesData} />
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
          <Card className="col-span-1 md:col-span-4 overflow-hidden">
            <USSDServiceChart data={data.serviceData} />
          </Card>
          <Card className="col-span-1 md:col-span-3">
            <div className="p-6 h-full flex flex-col justify-center">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">Overall Success Rate</h3>
                <div className="flex items-baseline space-x-2">
                  <div className="text-5xl font-bold text-primary">
                    {data.successRate.toFixed(1)}%
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">success rate</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Successful</span>
                    <span className="font-medium text-emerald-600">{data.metrics.successfulTransactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Failed</span>
                    <span className="font-medium text-red-600">{data.metrics.failedTransactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{data.metrics.totalTransactions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <USSDTransactionTable data={data.serviceData} />
        </Card>
      </div>
    </div>
  );
}
