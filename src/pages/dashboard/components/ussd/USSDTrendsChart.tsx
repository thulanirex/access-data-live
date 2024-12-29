import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

interface TrendDataPoint {
  timestamp: string;
  total: number;
  success: number;
  failed: number;
  successRate: number;
}

interface USSDTrendsChartProps {
  data: TrendDataPoint[];
}

export default function USSDTrendsChart({ data }: USSDTrendsChartProps) {
  const formattedData = data.map(point => ({
    ...point,
    formattedDate: format(parseISO(point.timestamp), 'HH:mm'),
    successRate: Number(point.successRate.toFixed(1))
  }));

  return (
    <div className="p-6">
      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold">Transaction Trends</h3>
        <p className="text-sm text-muted-foreground">
          Hourly transaction volume and success rate
        </p>
      </div>
      <div className="h-[350px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <XAxis
              dataKey="formattedDate"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="font-semibold">{payload[0].payload.formattedDate}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Total
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.total.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Success Rate
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.successRate}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Successful
                            </span>
                            <span className="font-bold text-emerald-600">
                              {payload[0].payload.success.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Failed
                            </span>
                            <span className="font-bold text-red-600">
                              {payload[0].payload.failed.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total"
              name="Total Volume"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="successRate"
              name="Success Rate"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
