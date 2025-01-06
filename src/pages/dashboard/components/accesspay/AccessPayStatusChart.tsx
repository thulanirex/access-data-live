import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

interface AccessPayStatusChartProps {
    data: {
        status: string;
        count: number;
    }[];
}

const STATUS_COLORS = {
    'Paid': '#22c55e',      // Green for success
    'Authorized': '#3b82f6', // Blue for authorized
    'Initiated': '#f59e0b',  // Yellow for pending
    'Rejected': '#ef4444',   // Red for failed
    'Returned': '#6b7280',   // Gray for returned
    'Verified': '#8b5cf6',   // Purple for verified
    'Unauthorized': '#dc2626' // Dark red for unauthorized
};

export default function AccessPayStatusChart({ data }: AccessPayStatusChartProps) {
    return (
        <>
            <CardHeader className="pb-8">
                <CardTitle className="text-lg font-semibold">Transaction Status Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Overview of transaction statuses
                </p>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={data} 
                            margin={{ top: 0, right: 15, left: 0, bottom: 30 }}
                            layout="vertical"
                        >
                            <XAxis type="number" />
                            <YAxis 
                                type="category"
                                dataKey="status"
                                width={100}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px',
                                }}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#6b7280'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </>
    );
}