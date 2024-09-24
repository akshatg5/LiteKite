import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<{ stocks: any[]; cash: number; total: number } | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/api/portfolio', {
          headers: {
            Authorization: token,
          },
        });
        setPortfolio(response.data);
      } catch (error: any) {
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else {
          console.error('Error:', error);
        }
        toast({
          title: 'Error',
          description: 'Failed to fetch portfolio. Please try again.',
          variant: 'destructive',
        });
      }
    };
  
    fetchPortfolio();
  }, [toast]);

  if (!portfolio) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { portfolio && portfolio.stocks?.map((stock) => (
                <TableRow key={stock.ticker}>
                  <TableCell className="font-medium">{stock.ticker}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>{stock.totalshares}</TableCell>
                  <TableCell>${stock.price.toFixed(2)}</TableCell>
                  <TableCell>${(stock.price * stock.totalshares).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
              {portfolio.stocks.length == 0 && <div className='flex justify-center items-center'>No stocks traded yet!</div>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cash Balance: ${portfolio?.cash.toFixed(2)}</p>
          <p>Total Portfolio Value: ${portfolio?.total.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;