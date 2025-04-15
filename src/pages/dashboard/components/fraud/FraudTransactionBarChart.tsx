import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { format } from 'date-fns';

interface TransactionsByInterval {
  interval: string;
  debitCount: number;
  creditCount: number;
  totalAmount: number;
}

interface FraudTransactionBarChartProps {
  data: TransactionsByInterval[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <div className="text-sm space-y-1">
          <p className="text-red-500">Debit Count: {payload[0].value}</p>
          <p className="text-green-500">Credit Count: {payload[1].value}</p>
          <p className="text-blue-500">Total Amount: {new Intl.NumberFormat('en-ZM', { 
            style: 'currency', 
            currency: 'ZMW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(payload[2].value as number)}</p>
        </div>
      </div>
    );
  }

  return null;
};

const FraudTransactionBarChart: React.FC<FraudTransactionBarChartProps> = ({ data }) => {
  // Format the interval for display
  const formattedData = data.map(item => {
    const [date, time] = item.interval.split(' ');
    return {
      ...item,
      interval: `${time}`,
      formattedInterval: item.interval
    };
  });

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="interval" 
            tick={{ fontSize: 12 }}
          />
          <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="debitCount" name="Debit Transactions" fill="#ef4444" />
          <Bar yAxisId="left" dataKey="creditCount" name="Credit Transactions" fill="#22c55e" />
          <Bar yAxisId="right" dataKey="totalAmount" name="Total Amount" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FraudTransactionBarChart;
