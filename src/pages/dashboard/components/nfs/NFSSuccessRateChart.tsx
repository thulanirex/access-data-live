import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

interface SuccessRateDataPoint {
  timestamp: string;
  rate: number;
}

interface NFSSuccessRateChartProps {
  data: SuccessRateDataPoint[];
}

export default function NFSSuccessRateChart({ data }: NFSSuccessRateChartProps) {
  const formattedData = data.map(point => ({
    ...point,
    formattedDate: format(parseISO(point.timestamp), 'MMM dd'),
  }));

  return (
    <div className="p-4 h-[400px]">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Success Rate Trend</h3>
        <p className="text-sm text-muted-foreground">
          Daily success rate over the selected period
        </p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formattedData}>
          <XAxis
            dataKey="formattedDate"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${typeof value === 'number' ? value.toFixed(1) : value}%`}
            domain={[
              (dataMin: number) => Math.floor(dataMin - 1),
              (dataMax: number) => Math.ceil(dataMax + 1)
            ]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Date
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].payload.formattedDate}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Success Rate
                        </span>
                        <span className="font-bold">
                          {typeof value === 'number' ? value.toFixed(1) : value}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "hsl(var(--primary))",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
