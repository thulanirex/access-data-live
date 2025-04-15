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
import { useAnalytics } from '@/hooks/useAnalytics';
import { useATMAnalytics } from '@/hooks/useATMAnalytics';
import { useAccessPayAnalytics } from '@/hooks/useAccessPayAnalytics';
import { useAgencyBankingAnalytics } from '@/hooks/useAgencyBankingAnalytics';
import { useRIBAnalytics } from '@/hooks/useRIBAnalytics';
import { useUSSDAnalytics } from '@/hooks/useUSSDAnalytics';

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
  rawData?: any[]; // For storing raw API response data
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [channel, setChannel] = useState<string>('TENGA');
  const [reportType, setReportType] = useState<string>('transactions');

  // Format dates for API calls
  const startDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
  const endDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  // Use the appropriate hook based on selected channel
  const { 
    loading: tengaLoading, 
    error: tengaError,
    successFailureData,
    channelMetrics,
    transactionMetrics,
    refetch: refetchTenga
  } = useAnalytics({
    startDate,
    endDate,
    channel: 'TENGA'
  });

  const {
    data: atmData,
    isLoading: atmLoading,
    error: atmError
  } = useATMAnalytics({
    startDate,
    endDate
  });

  const {
    data: accessPayData,
    isLoading: accessPayLoading,
    error: accessPayError
  } = useAccessPayAnalytics({
    startDate,
    endDate
  });

  const {
    data: agencyBankingData,
    isLoading: agencyBankingLoading,
    error: agencyBankingError
  } = useAgencyBankingAnalytics({
    startDate,
    endDate
  });

  const {
    data: ribData,
    isLoading: ribLoading,
    error: ribError
  } = useRIBAnalytics({
    startDate,
    endDate
  });

  const {
    data: ussdData,
    isLoading: ussdLoading,
    error: ussdError
  } = useUSSDAnalytics({
    startDate,
    endDate
  });

  const loading = tengaLoading || atmLoading || accessPayLoading || agencyBankingLoading || ribLoading || ussdLoading;
  const error = tengaError || atmError || accessPayError || agencyBankingError || ribError || ussdError;

  // Transform hook data into exportable format
  const getExportData = () => {
    switch (channel) {
      case 'ATM':
        return atmData?.detailReport?.map(item => ({
          failed_transactions: item.failed_transactions,
          success_transactions: item.success_transaction,
          total_transactions: item.total_transactions
        })) || [];
      case 'TENGA':
      default:
        return transactionMetrics.map(item => ({
          type: item.type,
          count: item.count,
          volume: item.volume,
          success_rate: item.successRate
        }));
    }
  };

  const exportToCSV = () => {
    const data = getExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics');
    XLSX.writeFile(wb, `${channel.toLowerCase()}_analytics_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = getExportData();

    // Add title
    doc.setFontSize(16);
    doc.text(`${channel} Analytics Report`, 14, 20);

    // Add filters info
    doc.setFontSize(10);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 30);

    // Add summary based on channel
    if (channel === 'ATM') {
      doc.text(`Total Transactions: ${atmData?.total || 0}`, 14, 40);
      doc.text(`Success Rate: ${atmData?.percentSuccess || 0}%`, 14, 45);
      doc.text(`Failure Rate: ${atmData?.percentFailed || 0}%`, 14, 50);
    } else {
      const totalTransactions = transactionMetrics.reduce((sum, item) => sum + item.count, 0);
      const avgSuccessRate = transactionMetrics.reduce((sum, item) => sum + item.successRate, 0) / transactionMetrics.length;
      
      doc.text(`Total Transactions: ${totalTransactions}`, 14, 40);
      doc.text(`Average Success Rate: ${avgSuccessRate.toFixed(2)}%`, 14, 45);
    }

    // Add data table
    const tableData = data.map((item: any) => Object.values(item));
    const headers = Object.keys(data[0] || {});

    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 60
    });

    doc.save(`${channel.toLowerCase()}_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
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
                  <SelectItem value="TENGA">TENGA</SelectItem>
                  <SelectItem value="ATM">ATM</SelectItem>
                  <SelectItem value="RIB">RIB</SelectItem>
                  <SelectItem value="USSD">USSD</SelectItem>
                  <SelectItem value="AGENCY">Agency Banking</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={channel === 'TENGA' ? refetchTenga : undefined}>
                Refresh Data
              </Button>
            </div>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="col-span-12">
              <div className="bg-red-50 text-red-600 p-4 rounded-md">
                {error.message}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="col-span-12">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-md">
                Loading data...
              </div>
            </div>
          )}
        </div>
      </LayoutBody>
    </Layout>
  );
}