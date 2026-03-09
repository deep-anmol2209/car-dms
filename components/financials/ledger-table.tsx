'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableFooter
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  date: string;
  type: 'sale' | 'expense';
  description: string;
  amount: number;
}

export function LedgerTable({ transactions }: { transactions: Transaction[] }) {
  const netProfit = transactions.reduce(
    (sum, t) => t.type === 'sale' ? sum + t.amount : sum - t.amount, 0
  );
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-slate-500">No transactions found</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="hover:bg-slate-50">
              <TableCell className="font-medium">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={transaction.type === 'sale' ? 'success' : 'destructive'}
                  className="capitalize"
                >
                  {transaction.type}
                </Badge>
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell 
                className={`text-right font-medium ${
                  transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'sale' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-slate-50">
          <TableRow>
            <TableCell colSpan={3} className="text-right font-bold text-slate-700">
              Net Profit
            </TableCell>
            <TableCell 
              className={`text-right font-bold text-lg ${
                netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
