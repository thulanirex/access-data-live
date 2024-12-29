import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface ServiceData {
  service: string;
  success: number;
  failed: number;
  total: number;
}

interface USSDTransactionTableProps {
  data: ServiceData[];
}

export default function USSDTransactionTable({ data }: USSDTransactionTableProps) {
  // Sort data by total transactions in descending order
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  return (
    <div className="p-6">
      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold">Transaction Details</h3>
        <p className="text-sm text-muted-foreground">
          Detailed breakdown of transactions for each service
        </p>
      </div>
      <div className="mt-6 relative">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">Service</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Successful</TableHead>
              <TableHead className="text-right">Failed</TableHead>
              <TableHead className="text-right w-[15%]">Success Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => {
              const successRate = item.total > 0 ? (item.success / item.total) * 100 : 0;
              return (
                <TableRow key={item.service} className="group">
                  <TableCell className="font-medium">{item.service}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.total.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end space-x-2 tabular-nums">
                      <span className="text-emerald-600">{item.success.toLocaleString()}</span>
                      {item.success > 0 && <ArrowUpIcon className="h-4 w-4 text-emerald-500" />}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end space-x-2 tabular-nums">
                      <span className="text-red-600">{item.failed.toLocaleString()}</span>
                      {item.failed > 0 && <ArrowDownIcon className="h-4 w-4 text-red-500" />}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end space-x-2 tabular-nums">
                      <span className={`font-medium ${
                        successRate >= 90 
                          ? 'text-emerald-600' 
                          : successRate >= 70 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {successRate.toFixed(1)}%
                      </span>
                      {successRate >= 90 ? (
                        <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                      ) : successRate >= 70 ? (
                        <MinusIcon className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500" />
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
