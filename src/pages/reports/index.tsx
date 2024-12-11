import { useState } from 'react';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Transaction {
  id: string;
  timestamp: Date;
  channel: string;
  amount: number;
  status: string;
  type: string;
}

interface AnalyticsData {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  channelBreakdown: {
    channel: string;
    count: number;
    volume: number;
  }[];
  hourlyTrends: {
    hour: string;
    count: number;
  }[];
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [channel, setChannel] = useState<string>('all');
  const [reportType, setReportType] = useState<string>('transactions');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalTransactions: 0,
    totalVolume: 0,
    successRate: 0,
    channelBreakdown: [],
    hourlyTrends: []
  });

  // Mock data generation (replace with actual API calls)
  const generateMockData = () => {
    const channels = ['ATM', 'POS', 'Mobile', 'Internet'];
    const mockTransactions: Transaction[] = [];
    const startDate = dateRange.from || new Date();
    const endDate = dateRange.to || new Date();

    // Generate mock transactions
    for (let i = 0; i < 1000; i++) {
      mockTransactions.push({
        id: `TXN${i}`,
        timestamp: new Date(
          startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
        ),
        channel: channels[Math.floor(Math.random() * channels.length)],
        amount: Math.floor(Math.random() * 10000),
        status: Math.random() > 0.05 ? 'SUCCESS' : 'FAILED',
        type: Math.random() > 0.5 ? 'PURCHASE' : 'WITHDRAWAL'
      });
    }

    // Calculate analytics
    const filtered = channel === 'all' 
      ? mockTransactions 
      : mockTransactions.filter(t => t.channel === channel);

    const analytics: AnalyticsData = {
      totalTransactions: filtered.length,
      totalVolume: filtered.reduce((sum, t) => sum + t.amount, 0),
      successRate: filtered.filter(t => t.status === 'SUCCESS').length / filtered.length * 100,
      channelBreakdown: channels.map(ch => ({
        channel: ch,
        count: filtered.filter(t => t.channel === ch).length,
        volume: filtered.filter(t => t.channel === ch)
          .reduce((sum, t) => sum + t.amount, 0)
      })),
      hourlyTrends: Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        count: filtered.filter(t => t.timestamp.getHours() === hour).length
      }))
    };

    setAnalyticsData(analytics);
    return filtered;
  };

  const exportToCSV = () => {
    const data = generateMockData();
    const ws = XLSX.utils.json_to_sheet(data.map(t => ({
      ...t,
      timestamp: format(t.timestamp, 'yyyy-MM-dd HH:mm:ss')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `transactions_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = generateMockData();

    // Add title
    doc.setFontSize(16);
    doc.text('Transaction Report', 14, 20);

    // Add filters info
    doc.setFontSize(10);
    doc.text(`Date Range: ${dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : 'All'} to ${dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : 'All'}`, 14, 30);
    doc.text(`Channel: ${channel}`, 14, 35);

    // Add summary
    doc.text(`Total Transactions: ${analyticsData.totalTransactions}`, 14, 45);
    doc.text(`Total Volume: $${analyticsData.totalVolume.toLocaleString()}`, 14, 50);
    doc.text(`Success Rate: ${analyticsData.successRate.toFixed(2)}%`, 14, 55);

    // Add transaction table
    const tableData = data.slice(0, 20).map(t => [
      format(t.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      t.channel,
      `$${t.amount}`,
      t.status,
      t.type
    ]);

    (doc as any).autoTable({
      head: [['Timestamp', 'Channel', 'Amount', 'Status', 'Type']],
      body: tableData,
      startY: 65
    });

    doc.save(`report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <Layout>
      <LayoutHeader>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="ml-auto space-x-2">
          <Button onClick={exportToCSV} variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </LayoutHeader>
      <LayoutBody>
        <div className="grid grid-cols-12 gap-4">
          {/* Filters */}
          <Card className="col-span-12 p-4">
            <div className="flex items-center space-x-4">
              <div>
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to
                  }}
                  onSelect={(range: any) => setDateRange(range)}
                  className="rounded-md border"
                />
              </div>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="ATM">ATM</SelectItem>
                  <SelectItem value="POS">POS</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Internet">Internet</SelectItem>
                </SelectContent>
              </Select>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="success">Success Rate</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => generateMockData()}>
                Generate Report
              </Button>
            </div>
          </Card>

          {/* Summary Cards */}
          <Card className="col-span-4 p-4">
            <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
            <p className="text-3xl font-bold">{analyticsData.totalTransactions.toLocaleString()}</p>
          </Card>
          <Card className="col-span-4 p-4">
            <h3 className="text-lg font-semibold mb-2">Total Volume</h3>
            <p className="text-3xl font-bold">${analyticsData.totalVolume.toLocaleString()}</p>
          </Card>
          <Card className="col-span-4 p-4">
            <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
            <p className="text-3xl font-bold">{analyticsData.successRate.toFixed(2)}%</p>
          </Card>

          {/* Charts */}
          <Card className="col-span-6 p-4">
            <h3 className="text-lg font-semibold mb-4">Channel Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.channelBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="col-span-6 p-4">
            <h3 className="text-lg font-semibold mb-4">Hourly Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.hourlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Transactions" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </LayoutBody>
    </Layout>
  );
}