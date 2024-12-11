import React from 'react';
import { BillerData } from './BillersData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BillersTableProps {
  data: BillerData[];
}

const BillersTable: React.FC<BillersTableProps> = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Biller</TableHeader>
          <TableHeader>Successful Count</TableHeader>
          <TableHeader>Successful Value</TableHeader>
          <TableHeader>Failed Count</TableHeader>
          <TableHeader>Failed Value</TableHeader>
          <TableHeader>Avg Value</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.biller}</TableCell>
            <TableCell>{item.successfulCount}</TableCell>
            <TableCell>{item.successfulValue}</TableCell>
            <TableCell>{item.failedCount}</TableCell>
            <TableCell>{item.failedValue}</TableCell>
            <TableCell>{item.avgValue}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BillersTable;
