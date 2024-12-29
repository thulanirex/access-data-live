import { TransactionTypeMetrics } from "@/types/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MobileSuccessRateChartProps {
    data: TransactionTypeMetrics[];
}

export default function MobileSuccessRateChart({ data }: MobileSuccessRateChartProps) {
    // Calculate total success and failure
    const totalSuccess = data.reduce((acc, curr) => acc + curr.successCount, 0);
    const totalFailure = data.reduce((acc, curr) => acc + curr.failureCount, 0);
    const total = totalSuccess + totalFailure;

    const chartData = [
        {
            name: 'Success',
            value: totalSuccess,
            percentage: total > 0 ? (totalSuccess / total) * 100 : 0,
            color: '#22c55e' // Green
        },
        {
            name: 'Failure',
            value: totalFailure,
            percentage: total > 0 ? (totalFailure / total) * 100 : 0,
            color: '#ef4444' // Red
        }
    ];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(1)}%`}
            </text>
        );
    };

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                            `${value.toLocaleString()} (${props.payload.percentage.toFixed(1)}%)`,
                            name
                        ]}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
                <div className="text-sm text-muted-foreground">
                    Based on {total.toLocaleString()} total transactions
                </div>
            </div>
        </div>
    );
}
