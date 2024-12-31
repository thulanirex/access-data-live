import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function USSD202ServicesChart({ data }) {
  const sortedServices = [...data].sort((a, b) => b.total - a.total)
  
  return (
    <div className="h-[400px] p-4">
      <h3 className="text-lg font-semibold mb-4">Services Performance</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedServices}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="service" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="success" stackId="a" fill="#22c55e" name="Success" />
          <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Failed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
