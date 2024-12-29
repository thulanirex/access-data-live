import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface ServiceData {
  service: string;
  success: number;
  failed: number;
  total: number;
}

interface USSDServiceChartProps {
  data: ServiceData[];
}

export default function USSDServiceChart({ data }: USSDServiceChartProps) {
  // Sort data by total transactions in descending order and filter out services with 0 total
  const sortedData = [...data]
    .filter(item => item.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="p-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold tracking-tight">Service Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Breakdown of transactions by service type
        </p>
      </div>
      <div className="h-[350px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData}>
            <XAxis 
              dataKey="service"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
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
                  const successRate = ((data.success / data.total) * 100).toFixed(1);
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="font-semibold">{data.service}</div>
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
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Total
                            </span>
                            <span className="font-bold">
                              {data.total.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Success Rate
                            </span>
                            <span className="font-bold">
                              {successRate}%
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
            <Legend />
            <Bar
              name="Successful"
              dataKey="success"
              fill="#34C759"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              name="Failed"
              dataKey="failed"
              fill="#FF3B3F"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
