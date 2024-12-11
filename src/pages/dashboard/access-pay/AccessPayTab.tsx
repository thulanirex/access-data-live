import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DepositsWithdrawalsChart from './DepositsWithdrawalsChart';
import SuccessFailurePieChart from './SuccessFailurePieChart';
import ATMComparisonChart from './AccessPayComparisonChart';

const trendData = [
  {
    metric: "Transaction Count",
    yesterday: "345",
    today: "1548",
    change: "+1203",
    status: "Improved"
  },
  {
    metric: "Success Rate",
    yesterday: "81.7%",
    today: "91.4%",
    change: "+9.7%",
    status: "Improved"
  },
  // {
  //   metric: "Average Value",
  //   yesterday: "K1,180",
  //   today: "K1,250",
  //   change: "+5.9%",
  //   status: "Improved"
  // },
];

const AccessPayTab = () => {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader className='bg-custom-green'>
            <CardTitle>Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ATMComparisonChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='bg-custom-green'>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <SuccessFailurePieChart />
          </CardContent>
        </Card>
      </div>

      {/* Trend Table */}
      <Card>
        <CardHeader className='bg-custom-green'>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Yesterday</TableHead>
                <TableHead>Today</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendData.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell>{row.yesterday}</TableCell>
                  <TableCell>{row.today}</TableCell>
                  <TableCell>{row.change}</TableCell>
                  <TableCell className={row.status === 'Improved' ? 'text-green-600' : 'text-red-600'}>
                    {row.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessPayTab;