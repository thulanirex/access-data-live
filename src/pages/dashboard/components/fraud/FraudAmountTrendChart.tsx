import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

interface AmountTrend {
  interval: string;
  amount: number;
  count: number;
}

interface FraudAmountTrendChartProps {
  data: AmountTrend[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <div className="text-sm space-y-1">
          <p className="text-blue-500">
            Amount: {new Intl.NumberFormat('en-ZM', { 
              style: 'currency', 
              currency: 'ZMW',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(payload[0].value as number)}
          </p>
          <p className="text-green-500">Transaction Count: {payload[1].value}</p>
        </div>
      </div>
    );
  }

  return null;
};

const FraudAmountTrendChart: React.FC<FraudAmountTrendChartProps> = ({ data }) => {
  // Format the interval for display
  const formattedData = data.map(item => {
    const [date, time] = item.interval.split(' ');
    return {
      ...item,
      interval: `${time}`,
      formattedInterval: item.interval
    };
  }).sort((a, b) => a.formattedInterval.localeCompare(b.formattedInterval));

  // Calculate the maximum amount for better Y-axis scaling
  const maxAmount = Math.max(...formattedData.map(item => item.amount));
  const yAxisMax = Math.ceil(maxAmount * 1.1 / 10000) * 10000; // Round up to nearest 10,000

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            tick={{ fontSize: 12 }} 
            domain={[0, yAxisMax]}
            tickFormatter={(value) => new Intl.NumberFormat('en-ZM', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value)}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="amount" 
            name="Transaction Amount" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="count" 
            name="Transaction Count" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FraudAmountTrendChart;
