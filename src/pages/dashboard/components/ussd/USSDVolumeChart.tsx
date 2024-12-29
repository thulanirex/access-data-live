import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

interface VolumeDataPoint {
  timestamp: string;
  total: number;
  success: number;
  failed: number;
}

interface USSDVolumeChartProps {
  data: VolumeDataPoint[];
}

export default function USSDVolumeChart({ data }: USSDVolumeChartProps) {
  const formattedData = data.map(point => ({
    ...point,
    formattedDate: format(parseISO(point.timestamp), 'HH:mm')
  }));

  return (
    <div className="p-6">
      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold">Transaction Volume</h3>
        <p className="text-sm text-muted-foreground">
          Hourly successful vs failed transactions
        </p>
      </div>
      <div className="h-[350px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
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
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="font-semibold">{data.formattedDate}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Successful
                            </span>
                            <span className="font-bold text-emerald-600">
                              {data.success.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Failed
                            </span>
                            <span className="font-bold text-red-600">
                              {data.failed.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col col-span-2">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Total
                            </span>
                            <span className="font-bold">
                              {data.total.toLocaleString()}
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
            <Bar
              dataKey="success"
              name="Successful"
              fill="#34C759"
              radius={[4, 4, 0, 0]}
              stackId="stack"
            />
            <Bar
              dataKey="failed"
              name="Failed"
              fill="#FF3B3F"
              radius={[4, 4, 0, 0]}
              stackId="stack"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
