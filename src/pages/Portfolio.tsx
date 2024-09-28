import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import url from '@/lib/url';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<{ stocks: any[]; cash: number; total: number } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${url}/portfolio`, {
          headers: {
            Authorization: token,
          },
        });
        setPortfolio(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate('/login')
        }
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
  }, [toast, navigate]);

  const getPnlClass = (value:number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500'
  }

  const calculateNetChange = (currentValue:number,avg_purcase_price:number,totalshares : number) => {
    const purchaseValue = totalshares * avg_purcase_price;
    const changePercent = ((currentValue - purchaseValue) / purchaseValue) * 100
    return changePercent
  }

  if (!portfolio) return <div className='flex justify-center items-center min-h-screen min-w-screen mx-auto'>Loading...</div>;

  return (
    <div className="space-y-6 p-5">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instrument</TableHead>
                <TableHead>Qty.</TableHead>
                <TableHead>Avg. Cost</TableHead>
                <TableHead>LTP</TableHead>
                <TableHead>Cur. Value</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Net Chg.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.stocks.map((stock) => {
                const pnl = stock.current_value - (stock.avg_purcase_price * stock.totalshares);
                const netPercentChange = calculateNetChange(stock.current_value,stock.avg_purcase_price,stock.totalshares)
                return (
                  <TableRow key={stock.ticker}>
                  <TableCell className="font-medium">{stock.ticker}</TableCell>
                  <TableCell>{stock.totalshares}</TableCell>
                  <TableCell>${stock.avg_purcase_price.toFixed(2)}</TableCell>
                  <TableCell>${stock.current_price.toFixed(2)}</TableCell>
                  <TableCell>${stock.current_value.toFixed(2)}</TableCell>
                  <TableCell className={getPnlClass(pnl)}>${pnl.toFixed(2)}</TableCell>
                  <TableCell className={getPnlClass(netPercentChange)}>{netPercentChange.toFixed(2)}%</TableCell>
                </TableRow>
                )
                }
              )}
            </TableBody>
          </Table>
          {portfolio.stocks.length === 0 && <div className='flex justify-center items-center'>No stocks traded yet!</div>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cash Balance:<span className='font-semibold'>{" "}${portfolio.cash.toFixed(2)}</span></p>
          <p>Total Portfolio Value: ${portfolio.total.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;