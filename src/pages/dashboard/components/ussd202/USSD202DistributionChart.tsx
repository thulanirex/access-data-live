import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#22c55e', '#ef4444']

export default function USSD202DistributionChart({ data }) {
  const pieData = [
    { name: 'Success', value: data.success },
    { name: 'Failed', value: data.failed }
  ]

  return (
    <div className="h-[400px] p-4">
      <h3 className="text-lg font-semibold mb-4">Transaction Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}