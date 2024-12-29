import { TransactionTypeMetrics } from "@/types/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TengaSuccessRateChartProps {
    data: TransactionTypeMetrics[];
}

export default function TengaSuccessRateChart({ data }: TengaSuccessRateChartProps) {
    // Calculate total success and failure from wallet transactions
    const walletMetrics = data
        .filter(t => t.type.toLowerCase().includes('wallet'))
        .reduce(
            (acc, curr) => {
                acc.success += curr.successCount;
                acc.failure += curr.failureCount;
                return acc;
            },
            { success: 0, failure: 0 }
        );

    const total = walletMetrics.success + walletMetrics.failure;
    const successRate = total > 0 ? (walletMetrics.success / total) * 100 : 0;
    const failureRate = total > 0 ? (walletMetrics.failure / total) * 100 : 0;

    const chartData = [
        { name: 'Success', value: successRate },
        { name: 'Failure', value: failureRate }
    ];

    const COLORS = ['#10B981', '#EF4444']; // Green for success, Red for failure

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            value,
                            name
                        }) => {
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
                                    {`${name} ${value.toFixed(1)}%`}
                                </text>
                            );
                        }}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => `${value.toFixed(1)}%`}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
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
