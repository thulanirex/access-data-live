import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface NFSTransactionType {
  name: string;
  completed: number;
  failed: number;
  pending: number;
  total: number;
}

interface NFSTransactionTypesChartProps {
  data: NFSTransactionType[];
}

export default function NFSTransactionTypesChart({ data }: NFSTransactionTypesChartProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState([10]);

  const filteredData = useMemo(() => {
    return data
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, displayCount[0]);
  }, [data, searchTerm, displayCount]);

  return (
    <div className="p-4 h-[400px]">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Transaction Types</h3>
        <Input
          placeholder="Search transaction types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing top {displayCount} types
            </span>
          </div>
          <Slider
            defaultValue={[10]}
            max={50}
            step={1}
            min={5}
            onValueChange={setDisplayCount}
            className="my-2"
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={filteredData}>
          <XAxis
            dataKey="name"
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
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="completed"
            name="Completed"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="failed"
            name="Failed"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="pending"
            name="Pending"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
