import { Card } from "@/components/ui/card";
import NFSMetricsCards from "./NFSMetricsCards";
import NFSTransactionTypesChart from "./NFSTransactionTypesChart";
import NFSSuccessRateChart from "./NFSSuccessRateChart";
import NFSTransactionTable from "./NFSTransactionTable";
import { useNFSAnalytics } from "@/hooks/useNFSAnalytics";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export default function NFSTab() {
  // Initialize with current date
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: today,
  });

  const formatApiDate = (date: Date) => format(date, 'dd-MMM-yyyy').toUpperCase();

  const { data, isLoading, error } = useNFSAnalytics({
    startDate: date?.from ? formatApiDate(date.from) : formatApiDate(today),
    endDate: date?.to ? formatApiDate(date.to) : formatApiDate(today),
  });

  console.log('NFSTab render state:', { 
    isLoading, 
    error, 
    hasData: !!data,
    date,
    formattedDates: {
      start: date?.from ? formatApiDate(date.from) : formatApiDate(today),
      end: date?.to ? formatApiDate(date.to) : formatApiDate(today),
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading NFS data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Error loading NFS data: {error.message}
          <br />
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">No NFS data available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {date?.from && date?.to && (date.from !== date.to) 
            ? `NFS Transactions (${formatApiDate(date.from)} - ${formatApiDate(date.to)})`
            : 'Today\'s NFS Transactions'
          }
        </h2>
        <DateRangePicker
          date={date}
          onDateChange={setDate}
        />
      </div>

      <NFSMetricsCards data={data.metrics} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <NFSTransactionTypesChart data={data.transactionTypes} />
        </Card>
        <Card className="col-span-3">
          <NFSSuccessRateChart data={data.successRate} />
        </Card>
      </div>

      <Card>
        <NFSTransactionTable data={data.transactionTypes} />
      </Card>
    </div>
  );
}
