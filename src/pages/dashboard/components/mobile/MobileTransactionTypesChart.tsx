import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { TransactionTypeMetrics } from "@/types/api";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface MobileTransactionTypesChartProps {
    data: TransactionTypeMetrics[];
}

export default function MobileTransactionTypesChart({ data }: MobileTransactionTypesChartProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [minSuccessRate, setMinSuccessRate] = useState(0);

    const chartData = useMemo(() => {
        return data
            .filter(t => t.type.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(t => t.successRate >= minSuccessRate)
            .sort((a, b) => {
                // First sort by success rate
                const rateComparison = b.successRate - a.successRate;
                // If success rates are equal, sort by total volume
                return rateComparison !== 0 ? rateComparison : b.total - a.total;
            })
            .map(t => ({
                name: t.type,
                "Success Rate": t.successRate,
                "Total Volume": t.total
            }));
    }, [data, searchTerm, minSuccessRate]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-4">
                    <Input
                        placeholder="Search transaction types..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <div className="flex items-center space-x-2 min-w-[200px]">
                        <span className="text-sm text-muted-foreground">
                            Min Success Rate: {minSuccessRate}%
                        </span>
                        <Slider
                            value={[minSuccessRate]}
                            onValueChange={([value]) => setMinSuccessRate(value)}
                            max={100}
                            step={1}
                        />
                    </div>
                </div>
            </div>
            
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis 
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            tick={{fontSize: 12}}
                        />
                        <YAxis 
                            yAxisId="left"
                            orientation="left"
                            stroke="#82ca9d"
                            label={{ 
                                value: 'Success Rate (%)', 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            stroke="#8884d8"
                            label={{ 
                                value: 'Total Volume', 
                                angle: 90, 
                                position: 'insideRight',
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <Tooltip />
                        <Bar 
                            dataKey="Success Rate"
                            fill="#82ca9d"
                            yAxisId="left"
                            name="Success Rate (%)"
                        />
                        <Bar 
                            dataKey="Total Volume"
                            fill="#8884d8"
                            yAxisId="right"
                            name="Total Volume"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
