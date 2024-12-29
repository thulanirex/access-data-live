import { TransactionTypeMetrics } from "@/types/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TengaTrendAnalysisProps {
    data: TransactionTypeMetrics[];
}

export default function TengaTrendAnalysis({ data }: TengaTrendAnalysisProps) {
    // Filter wallet transactions and sort by type
    const walletTransactions = data
        .filter(t => t.type.toLowerCase().includes('wallet'))
        .sort((a, b) => b.total - a.total);

    // Transform data for the line chart
    const chartData = walletTransactions.map(transaction => ({
        name: transaction.type.replace('WALLET', '').trim(), // Clean up the name
        Total: transaction.total,
        Success: transaction.successCount,
        Failure: transaction.failureCount,
        'Success Rate': Number(transaction.successRate.toFixed(1))
    }));

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                    />
                    <YAxis 
                        yAxisId="left" 
                        label={{ 
                            value: 'Number of Transactions', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' }
                        }}
                    />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        label={{ 
                            value: 'Success Rate (%)', 
                            angle: 90, 
                            position: 'insideRight',
                            style: { textAnchor: 'middle' }
                        }}
                    />
                    <Tooltip 
                        formatter={(value: number, name: string) => [
                            name === 'Success Rate' ? `${value}%` : value.toLocaleString(),
                            name
                        ]}
                        labelStyle={{ color: 'black' }}
                        contentStyle={{ 
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Total"
                        name="Total Transactions"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Success"
                        name="Successful"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Failure"
                        name="Failed"
                        stroke="#ff7f7f"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="Success Rate"
                        stroke="#ffc658"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
