// src/pages/dashboard/components/ussd202/USSD202MetricsCards.tsx
import { Card } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

export default function USSD202MetricsCards({ data }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Total Transactions</span>
          <span className="text-3xl font-bold">{data.total.toLocaleString()}</span>
        </div>
      </Card>
      <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-green-600">
              {data.percentSuccess.toFixed(1)}%
            </span>
            <ArrowUpIcon className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-sm text-muted-foreground">
            {data.success.toLocaleString()} transactions
          </span>
        </div>
      </Card>
      {/* Add other metric cards */}
    </div>
  )
}

