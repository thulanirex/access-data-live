import { Card } from "@/components/ui/card"
import { useUSSD202Analytics } from "@/hooks/useUSSD202Analytics"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useState } from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import USSD202MetricsCards from "./USSD202MetricsCards"
import USSD202ServicesChart from "./USSD202ServicesChart"
import USSD202DistributionChart from "./USSD202DistributionChart"
import USSD202ServicesTable from "./USSD202ServicesTable"

export default function USSD202Tab() {
  const today = new Date()
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: today,
  })

  const formatApiDate = (date: Date) => format(date, 'dd-MMM-yyyy').toUpperCase()

  const { data, isLoading, error } = useUSSD202Analytics({
    startDate: date?.from ? formatApiDate(date.from) : formatApiDate(today),
    endDate: date?.to ? formatApiDate(date.to) : formatApiDate(today),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading USSD (*202#) data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Error loading USSD (*202#) data: {error.message}
          <br />
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">No USSD (*202#) data available</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {date?.from && date?.to && (date.from !== date.to) 
            ? `USSD (*202#) Transactions (${formatApiDate(date.from)} - ${formatApiDate(date.to)})`
            : 'Today\'s USSD (*202#) Transactions'
          }
        </h2>
        <DateRangePicker
          date={date}
          onDateChange={setDate}
        />
      </div>

      <USSD202MetricsCards data={data} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <USSD202ServicesChart data={data.detailReport} />
        </Card>
        <Card className="col-span-3">
          <USSD202DistributionChart data={data} />
        </Card>
      </div>

      <Card>
        <USSD202ServicesTable data={data.detailReport} />
      </Card>
    </div>
  )
}