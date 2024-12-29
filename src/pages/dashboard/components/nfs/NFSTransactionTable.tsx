import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NFSTransactionType {
  name: string;
  completed: number;
  failed: number;
  pending: number;
  total: number;
}

interface NFSTransactionTableProps {
  data: NFSTransactionType[];
}

export default function NFSTransactionTable({ data }: NFSTransactionTableProps) {
  return (
    <div className="space-y-4">
      <div className="p-4">
        <h3 className="text-lg font-medium">Transaction Summary by Provider</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Failed</TableHead>
            <TableHead>Pending</TableHead>
            <TableHead>Success Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.total}</TableCell>
              <TableCell>{item.completed}</TableCell>
              <TableCell>{item.failed}</TableCell>
              <TableCell>{item.pending}</TableCell>
              <TableCell>
                {((item.completed / item.total) * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
