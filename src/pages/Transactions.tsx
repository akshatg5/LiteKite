import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import url from '@/lib/url';

interface Transsactions {
    type : any;
    ticker : any;
    price : any;
    shares : any;
    time : any;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transsactions[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${url}/history`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch transactions. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchTransactions();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.ticker}</TableCell>
                <TableCell>${transaction.price.toFixed(2)}</TableCell>
                <TableCell>{transaction.shares}</TableCell>
                <TableCell>{new Date(transaction.time).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Transactions;