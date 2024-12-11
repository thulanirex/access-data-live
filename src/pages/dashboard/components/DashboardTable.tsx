import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { IconArrowUpRight, IconChartBar } from "@tabler/icons-react";

interface ChannelData {
  channel: string;
  volume: number;
  avgValue: string;
  successRate: string;
  trend: 'up' | 'down';
  previousVolume?: number;
  icon?: string;
}

const initialData: ChannelData[] = [
  { channel: 'Tenga', volume: 2890, avgValue: '690', successRate: '93%', trend: 'up' },
  { channel: 'ATM', volume: 20730, avgValue: '9649', successRate: '91.4%', trend: 'up' },
  { channel: 'USSD', volume: 8865, avgValue: '4397', successRate: '90%', trend: 'up' },
  { channel: 'Mobile Banking', volume: 4631, avgValue: '4333', successRate: '81.1%', trend: 'up' },
  { channel: 'OBDX', volume: 885, avgValue: '569', successRate: '97%', trend: 'up' },
  { channel: 'Access Pay', volume: 820, avgValue: '1240', successRate: '75.3%', trend: 'down' },
  { channel: 'Access More', volume: 57, avgValue: '50', successRate: '100%', trend: 'up' },
];

const DashboardTable = () => {
  const [tableData, setTableData] = useState<ChannelData[]>(initialData);

  // Function to generate random changes
  const updateChannelData = (data: ChannelData): ChannelData => {
    const previousVolume = data.volume;
    // Only increase volume (1-3% increase)
    const increasePercent = Math.random() * 2 + 1; 
    const newVolume = Math.floor(data.volume * (1 + increasePercent / 100));
    
    // Success rate can fluctuate
    const newSuccessRate = Math.min(100, Math.max(70, 
      parseFloat(data.successRate) + (Math.random() * 1 - 0.5)
    )).toFixed(1);
    
    // Update average based on new volume
    const newAvg = Math.floor(newVolume / 24).toString(); // Assuming hourly average
    
    return {
      ...data,
      volume: newVolume,
      previousVolume,
      avgValue: newAvg,
      successRate: `${newSuccessRate}%`,
      trend: parseFloat(newSuccessRate) >= parseFloat(data.successRate) ? 'up' : 'down'
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTableData(currentData => 
        currentData.map(updateChannelData)
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <IconChartBar className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Channel Performance Metrics</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead className="w-[200px] font-semibold">Channel</TableHead>
            <TableHead className="text-right font-semibold">Transaction Count</TableHead>
            <TableHead className="text-right font-semibold">Hourly Average</TableHead>
            <TableHead className="text-right font-semibold w-[150px]">Success Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => {
            const hasIncreased = row.previousVolume ? row.volume > row.previousVolume : false;
            
            return (
              <TableRow 
                key={index} 
                className={cn(
                  "hover:bg-muted/50 transition-colors duration-200",
                  index % 2 === 0 ? "bg-muted/5" : ""
                )}
              >
                <TableCell className="font-medium">{row.channel}</TableCell>
                <TableCell 
                  className={cn(
                    "text-right tabular-nums transition-all duration-500",
                    hasIncreased && "text-green-600 scale-105"
                  )}
                >
                  <div className="flex items-center justify-end gap-1">
                    {row.volume.toLocaleString()}
                    {hasIncreased && (
                      <IconArrowUpRight className="h-4 w-4 text-green-500 animate-pulse" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {parseInt(row.avgValue).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div 
                    className={cn(
                      "inline-flex items-center justify-end gap-1 px-2 py-1 rounded-full text-sm",
                      parseFloat(row.successRate) >= 90 ? "bg-green-100 text-green-700" :
                      parseFloat(row.successRate) >= 80 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    )}
                  >
                    {row.successRate}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DashboardTable;