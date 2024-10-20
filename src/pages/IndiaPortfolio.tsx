import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import url from "@/lib/url";
import AnalyzeDialog from "@/components/AnalayzeDialog";
import { InteractiveIndianStockChart } from "@/components/IndianStockGraph";

interface PortfolioStock {
  ticker: string;
  totalShares: number;
  avg_purchase_price: number;
  current_price: number;
  current_value: number;
  name: string;
}

interface Portfolio {
  stocks: PortfolioStock[];
  cash: number;
  total: number;
}

const IndianPortfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${url}/indianportfolio`, {
          headers: {
            Authorization: token,
          },
        });
        setPortfolio(response.data);
        if (response.data.stocks.length > 0) {
          setSelectedStock(response.data.stocks[0].ticker);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching portfolio:", error);
          toast({
            title: "Error",
            description: "Failed to fetch portfolio. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    fetchPortfolio();
  }, [toast, navigate]);

  const getPnlClass = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-500";
  };

  const calculateNetChange = (currentValue: number, avgPurchasePrice: number, totalShares: number) => {
    const purchaseValue = totalShares * avgPurchasePrice;
    return ((currentValue - purchaseValue) / purchaseValue) * 100;
  };

  if (!portfolio) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6 mx-4 my-2">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.stocks.length === 0 ? (
            <div className="text-center py-4">No stocks traded yet!</div>
          ) : (
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
                  <TableHead>AI Support</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.stocks.map((stock) => {
                  const pnl = stock.current_value - stock.avg_purchase_price * stock.totalShares;
                  const netPercentChange = calculateNetChange(
                    stock.current_value,
                    stock.avg_purchase_price,
                    stock.totalShares
                  );
                  return (
                    <TableRow key={stock.ticker}>
                      <TableCell className="flex items-center space-x-2">
                        <Button
                          variant={selectedStock === stock.ticker ? "secondary" : "ghost"}
                          onClick={() => setSelectedStock(stock.ticker)}
                          className="w-full justify-start"
                        >
                          {stock.ticker.split('.')[0]}
                        </Button>
                        <Link to={`/info/${stock.ticker}`}>
                          <Info className="h-4 w-4" />
                        </Link>
                      </TableCell>
                      <TableCell>{stock.totalShares}</TableCell>
                      <TableCell>₹{stock.avg_purchase_price.toFixed(2)}</TableCell>
                      <TableCell>₹{stock.current_price.toFixed(2)}</TableCell>
                      <TableCell>₹{stock.current_value.toFixed(2)}</TableCell>
                      <TableCell className={getPnlClass(pnl)}>
                        ₹{pnl.toFixed(2)}
                      </TableCell>
                      <TableCell className={getPnlClass(netPercentChange)}>
                        {netPercentChange.toFixed(2)}%
                      </TableCell>
                      <TableCell>
                        <AnalyzeDialog
                          stock={stock.ticker.split('.')[0]}
                          avg_price={stock.avg_purchase_price}
                          ltp={stock.current_price}
                          shares={stock.totalShares}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {selectedStock && (
        <Card>
          <CardHeader>
            <CardTitle>Stock Chart: {selectedStock}</CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveIndianStockChart ticker={selectedStock} />
          </CardContent>
        </Card>
      )}
        <Card className='mx-2 mb-4 mt-2'>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Cash Balance:
            <span className="font-semibold"> ${portfolio.cash.toFixed(2)}</span>
          </p>
          <p>Total Portfolio Value: ${portfolio.total.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndianPortfolio;