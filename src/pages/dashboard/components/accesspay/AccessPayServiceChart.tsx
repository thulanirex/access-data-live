// src/pages/dashboard/components/accesspay/AccessPayServiceChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AccessPayServiceChartProps {
    data: {
        status: string;
        description: string;
        count: number;
    }[];
}

export default function AccessPayServiceChart({ data }: AccessPayServiceChartProps) {
    return (
        <>
            <CardHeader className="pb-8">
                <CardTitle className="text-lg font-semibold">Transaction Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Breakdown of transactions by status and type
                </p>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 15, left: 0, bottom: 0 }}>
                            <XAxis 
                                dataKey="description"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px',
                                }}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar
                                dataKey="count"
                                fill="#34C759"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </>
    );
}