export default function USSD202ServicesTable({ data }) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Service Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 bg-muted/50">Service</th>
                <th className="text-right p-3 bg-muted/50">Total</th>
                <th className="text-right p-3 bg-muted/50">Success</th>
                <th className="text-right p-3 bg-muted/50">Failed</th>
                <th className="text-right p-3 bg-muted/50">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((service) => (
                <tr key={service.service} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3">{service.service}</td>
                  <td className="text-right p-3 font-medium">{service.total}</td>
                  <td className="text-right p-3 text-green-600">{service.success}</td>
                  <td className="text-right p-3 text-red-600">{service.failed}</td>
                  <td className="text-right p-3 font-medium">
                    {((service.success / service.total) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  