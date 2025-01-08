import React, { useState, useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { TransactionTypeMetrics } from '@/types/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LineChart, Line } from 'recharts';

interface TengaTransactionTypesChartProps {
    data: TransactionTypeMetrics[];
}

type SortOption = 'volume' | 'success-rate' | 'alphabetical';

const TengaTransactionTypesChart: React.FC<TengaTransactionTypesChartProps> = ({ data }) => {
    const [sortBy, setSortBy] = useState<SortOption>('volume');
    const [searchTerm, setSearchTerm] = useState('');
    const [minSuccessRate, setMinSuccessRate] = useState(0);

    const filteredAndSortedData = useMemo(() => {
        let processed = data
            // Filter by search term
            .filter(item => 
                item.type.toLowerCase().includes(searchTerm.toLowerCase()) &&
                item.successRate >= minSuccessRate
            )
            // Sort data
            .sort((a, b) => {
                switch (sortBy) {
                    case 'volume':
                        return (b.successCount + b.failureCount) - (a.successCount + a.failureCount);
                    case 'success-rate':
                        return b.successRate - a.successRate;
                    case 'alphabetical':
                        return a.type.localeCompare(b.type);
                    default:
                        return 0;
                }
            });

        return processed.map(item => ({
            name: item.type,
            Success: item.successCount,
            Failure: item.failureCount,
            SuccessRate: item.successRate
        }));
    }, [data, sortBy, searchTerm, minSuccessRate]);

    // Filter wallet transactions and sort by type
    const walletTransactions = data
        .filter(t => t.type.toLowerCase())
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
        <div className="space-y-4">
            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <Input
                        placeholder="Search transaction types..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Min Success Rate:</span>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        value={minSuccessRate}
                        onChange={(e) => setMinSuccessRate(Number(e.target.value))}
                        className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                </div>
                <Select
                    value={sortBy}
                    onValueChange={(value: SortOption) => setSortBy(value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="volume">Sort by Volume</SelectItem>
                        <SelectItem value="success-rate">Sort by Success Rate</SelectItem>
                        <SelectItem value="alphabetical">Sort Alphabetically</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredAndSortedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        domain={[0, 100]}
                        label={{ value: 'Success Rate (%)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip 
                        formatter={(value: number, name: string) => [
                            name === 'SuccessRate' ? `${value.toFixed(1)}%` : value,
                            name
                        ]}
                    />
                    <Legend />
                    <Bar 
                        yAxisId="left"
                        dataKey="Success" 
                        fill="#16a34a" 
                        stackId="a"
                    />
                    <Bar 
                        yAxisId="left"
                        dataKey="Failure" 
                        fill="#dc2626" 
                        stackId="a"
                    />
                    <Bar
                        yAxisId="right"
                        dataKey="SuccessRate"
                        fill="#2563eb"
                        type="monotone"
                    />
                </BarChart>
            </ResponsiveContainer>

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
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip 
                            formatter={(value: number) => value.toLocaleString()}
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
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Success"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Failure"
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
        </div>
    );
};

export default TengaTransactionTypesChart;
