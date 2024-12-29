import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { IconArrowUpRight } from "@tabler/icons-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface TransactionStatus {
  pending: number;
  approved: number;
  rejected: number;
}

interface TransactionMetrics {
  id: string;
  name: string;
  count: number;
  status: TransactionStatus;
}

interface ObdxMetrics {
  rtgsIncomingSwift: TransactionMetrics;
  rtgsChannels: TransactionMetrics;
  chequesIncoming: TransactionMetrics;
  ddacChannels: TransactionMetrics;
  ttOutgoing: TransactionMetrics;
  rtgsOutgoingSwift: TransactionMetrics;
  ddacInwards: TransactionMetrics;
  rtgsIncomingTrustlink: TransactionMetrics;
  ttInward: TransactionMetrics;
  timestamp: string;
}

// Base counts that will only increase
const baseTransactions: { [key: string]: number } = {
  rtgsIncomingSwift: 1000,
  rtgsChannels: 800,
  chequesIncoming: 600,
  ddacChannels: 750,
  ttOutgoing: 400,
  rtgsOutgoingSwift: 550,
  ddacInwards: 650,
  rtgsIncomingTrustlink: 450,
  ttInward: 350
};

// Function to generate realistic increasing numbers
const generateIncreasingCount = (base: number): number => {
  return base + Math.floor(Math.random() * 50); // Increases by 0-50 transactions
};

const generateStatus = (): TransactionStatus => ({
  pending: Math.floor(Math.random() * 50),
  approved: Math.floor(Math.random() * 100) + 50,
  rejected: Math.floor(Math.random() * 20)
});

// Simulated data generator with increasing counts
const generateObdxData = (): ObdxMetrics => {
  // Update base counts
  Object.keys(baseTransactions).forEach(key => {
    baseTransactions[key] = generateIncreasingCount(baseTransactions[key]);
  });

  return {
    rtgsIncomingSwift: {
      id: 'rtgs-swift-in',
      name: 'RTGS - Incoming (ABZ-Group SWIFT)',
      count: baseTransactions.rtgsIncomingSwift,
      status: generateStatus()
    },
    rtgsChannels: {
      id: 'rtgs-channels',
      name: 'RTGS - Channels (OBDX, Access Pay, Mobile)',
      count: baseTransactions.rtgsChannels,
      status: generateStatus()
    },
    chequesIncoming: {
      id: 'cheques-in',
      name: 'Cheques - Incoming',
      count: baseTransactions.chequesIncoming,
      status: generateStatus()
    },
    ddacChannels: {
      id: 'ddac-channels',
      name: 'DDAC - Channels (OBDX, Tenga, Mobile)',
      count: baseTransactions.ddacChannels,
      status: generateStatus()
    },
    ttOutgoing: {
      id: 'tt-out',
      name: 'Telegraphic Transfers - Outgoing',
      count: baseTransactions.ttOutgoing,
      status: generateStatus()
    },
    rtgsOutgoingSwift: {
      id: 'rtgs-swift-out',
      name: 'RTGS - Outgoing (ABZ-Group SWIFT)',
      count: baseTransactions.rtgsOutgoingSwift,
      status: generateStatus()
    },
    ddacInwards: {
      id: 'ddac-in',
      name: 'DDAC - Inwards',
      count: baseTransactions.ddacInwards,
      status: generateStatus()
    },
    rtgsIncomingTrustlink: {
      id: 'rtgs-trustlink-in',
      name: 'RTGS - Incoming (Trust link)',
      count: baseTransactions.rtgsIncomingTrustlink,
      status: generateStatus()
    },
    ttInward: {
      id: 'tt-in',
      name: 'Telegraphic Transfers - Inward',
      count: baseTransactions.ttInward,
      status: generateStatus()
    },
    timestamp: new Date().toISOString()
  };
};

const TransactionStatsTable = () => {
  const [liveData, setLiveData] = useState<ObdxMetrics>(generateObdxData());
  const [, setHistoricalData] = useState<ObdxMetrics[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateObdxData();
      setLiveData(newData);
      setHistoricalData(prev => [...prev.slice(-20), newData]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSuccessRate = (status: TransactionStatus) => {
    const total = status.pending + status.approved + status.rejected;
    return total > 0 ? Number(((status.approved / total) * 100).toFixed(1)) : 0;
  };

  const transactions = Object.entries(liveData)
    .filter(([key]) => key !== 'timestamp')
    .map(([key, value]) => ({
      id: key,
      name: key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim(),
      count: value.count,
      status: value.status
    }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Total Transactions</span>
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                {transactions.reduce((sum, t) => sum + t.count, 0)}
              </span>
              <IconArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Overall Success Rate</span>
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                {(transactions.reduce((sum, t) => sum + getSuccessRate(t.status), 0) / transactions.length).toFixed(1)}%
              </span>
              <IconArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transactions}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="status.pending" name="Pending" fill="#ffd700" />
                <Bar dataKey="status.approved" name="Approved" fill="#82ca9d" />
                <Bar dataKey="status.rejected" name="Rejected" fill="#ff7f7f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Volume Trend */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Transaction Volume Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tick={false} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rtgsIncomingSwift.count" name="RTGS Swift In" stroke="#8884d8" />
                <Line type="monotone" dataKey="rtgsChannels.count" name="RTGS Channels" stroke="#82ca9d" />
                <Line type="monotone" dataKey="ddacChannels.count" name="DDAC Channels" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card> */}

      {/* Detailed Transaction Table */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Transaction Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] text-base font-bold">Service</TableHead>
                <TableHead className="text-right text-base font-bold">Count</TableHead>
                <TableHead className="text-right text-base font-bold">Pending</TableHead>
                <TableHead className="text-right text-base font-bold">Approved</TableHead>
                <TableHead className="text-right text-base font-bold">Rejected</TableHead>
                <TableHead className="text-right text-base font-bold">Success Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-slate-100">
                  <TableCell className="font-medium text-base">{transaction.name}</TableCell>
                  <TableCell className="text-right font-medium text-base">
                    {transaction.count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-900">
                      {transaction.status.pending.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-900">
                      {transaction.status.approved.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-200 text-red-900">
                      {transaction.status.rejected.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      getSuccessRate(transaction.status) >= 90
                        ? 'bg-green-200 text-green-900'
                        : getSuccessRate(transaction.status) >= 70
                        ? 'bg-yellow-200 text-yellow-900'
                        : 'bg-red-200 text-red-900'
                    }`}>
                      {getSuccessRate(transaction.status)}%
                    </span>
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

export const ObdxTab = () => {
  return (
    <div className='grid gap-4'>
      <Card className='col-span-2'>
        <CardHeader>
          <CardTitle>Live Transaction Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionStatsTable />
        </CardContent>
      </Card>
    </div>
  );
};