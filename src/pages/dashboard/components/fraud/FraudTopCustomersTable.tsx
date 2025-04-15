import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, TrendingUp } from "lucide-react";

interface TopCustomer {
  customerId: string;
  customerName: string;
  totalAmount: number;
  transactionCount: number;
}

interface FraudTopCustomersTableProps {
  data: TopCustomer[];
}

const FraudTopCustomersTable: React.FC<FraudTopCustomersTableProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', { 
      style: 'currency', 
      currency: 'ZMW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getVolumeCategory = (amount: number) => {
    if (amount > 500000) return { label: 'Very High', color: 'bg-red-500 hover:bg-red-600' };
    if (amount > 200000) return { label: 'High', color: 'bg-amber-500 hover:bg-amber-600' };
    if (amount > 100000) return { label: 'Medium', color: 'bg-yellow-500 hover:bg-yellow-600' };
    return { label: 'Normal', color: 'bg-green-500 hover:bg-green-600' };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Customer</TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span>Transaction Count</span>
                <TrendingUp className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span>Total Amount</span>
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Volume Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No customer data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((customer) => {
              const volumeCategory = getVolumeCategory(customer.totalAmount);
              return (
                <TableRow key={customer.customerId}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="truncate max-w-[180px]" title={customer.customerName}>
                        {customer.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground">{customer.customerId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">{customer.transactionCount}</span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(customer.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={volumeCategory.color}>
                      {volumeCategory.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FraudTopCustomersTable;
