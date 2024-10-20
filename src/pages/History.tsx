import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import url from "@/lib/url";
import { DollarSign, IndianRupee } from "lucide-react";

interface Transaction {
  type: string;
  ticker: string;
  price: number;
  shares: number;
  time: string;
}

const History: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [indiantransactions,setIndianTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchTransactionHistory = async () => {
      try {
        const response = await axios.get(`${url}/history`, {
          headers: {
            Authorization: token,
          },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error("Error fetching transaction history:", err);
      }
    };
    const fetchTransactionHistoryForIndianStocks = async () => {
      try {
        const response = await axios.get(`${url}/indianstockhistory`, {
          headers: {
            Authorization: token,
          },
        });
        setIndianTransactions(response.data);
      } catch (err) {
        console.error("Error fetching transaction history:", err);
      }
    };
    fetchTransactionHistoryForIndianStocks()
    fetchTransactionHistory();
  }, []);

  return (
    <>
    <Card className="w-full max-w-4xl mx-auto mt-5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex justify-between items-center space-x-2">
          Transaction History for Indian Stocks <IndianRupee />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent transactions for Indian Shares</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {indiantransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>
                  {transaction.type === "BUY" ? (
                    <Button className="w-8 h-6 mr-1 bg-green-500 text-white text-xs px-4 py-2 font-medium">
                      Buy
                    </Button>
                  ) : (
                    <Button className="w-8 h-6 mr-1 bg-red-500 text-white text-xs px-4 py-2 font-medium">
                      Sell
                    </Button>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.ticker.split('.')[0]}
                </TableCell>
                <TableCell className="text-right">
                ₹{transaction.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.shares}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ${(transaction.price * transaction.shares).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(transaction.time).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    
    <Card className="w-full max-w-4xl my-5 mx-auto mt-5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex justify-between items-center">
          Transaction History for US Stocks <DollarSign /> 
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent transactions for US shares</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>
                  {transaction.type === "BUY" ? (
                    <Button className="w-8 h-6 mr-1 bg-green-500 text-white text-xs px-4 py-2 font-medium">
                      Buy
                    </Button>
                  ) : (
                    <Button className="w-8 h-6 mr-1 bg-red-500 text-white text-xs px-4 py-2 font-medium">
                      Sell
                    </Button>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.ticker}
                </TableCell>
                <TableCell className="text-right">
                  ${transaction.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.shares}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ${(transaction.price * transaction.shares).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(transaction.time).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
            </>
  );
};

export default History;
