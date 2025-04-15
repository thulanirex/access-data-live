import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  TooltipProps
} from 'recharts';

interface DrCrDistribution {
  type: 'Debit' | 'Credit';
  count: number;
  amount: number;
}

interface FraudDistributionPieChartProps {
  data: DrCrDistribution[];
}

const COLORS = ['#ef4444', '#22c55e'];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">{data.type}</p>
        <div className="text-sm space-y-1">
          <p>Count: {data.count}</p>
          <p>Amount: {new Intl.NumberFormat('en-ZM', { 
            style: 'currency', 
            currency: 'ZMW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(data.amount)}</p>
          <p>Percentage: {((data.count / (data.count + (data.type === 'Debit' ? payload[1]?.payload.count : payload[0]?.payload.count))) * 100).toFixed(1)}%</p>
        </div>
      </div>
    );
  }

  return null;
};

const FraudDistributionPieChart: React.FC<FraudDistributionPieChartProps> = ({ data }) => {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="h-[400px] w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-muted/20 p-4 rounded-md">
          <h4 className="text-sm font-medium mb-2">Transaction Count</h4>
          <div className="text-2xl font-bold">{totalCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Total transactions</div>
        </div>
        <div className="bg-muted/20 p-4 rounded-md">
          <h4 className="text-sm font-medium mb-2">Transaction Amount</h4>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-ZM', { 
              style: 'currency', 
              currency: 'ZMW',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(totalAmount)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Total value</div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="type"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FraudDistributionPieChart;
