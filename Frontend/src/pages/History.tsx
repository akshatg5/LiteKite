import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  type: string;
  ticker: string;
  price: number;
  shares: number;
  time: string;
}

const History: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    const fetchTransactionHistory = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/history", {
          headers: {
            Authorization: token,
          },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error("Error fetching transaction history:", err);
      }
    };
    fetchTransactionHistory();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent transactions</TableCaption>
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
  );
};

export default History;
