import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const TradeForm = ({ action }: { action: any }) => {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://litekitebackend.vercel.app/api/balance", {
          headers: {
            Authorization: token,
          },
        });
        setBalance(res.data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast({
          title: "Error",
          description: "Failed to fetch balance",
          variant: "destructive",
        });
      }
    };
    getBalance();
  }, [toast]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://litekitebackend.vercel.app/api/${action.toLowerCase()}`,
        { symbol, shares: parseInt(shares) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      toast({
        title: "Success",
        description: response.data.message,
      });
      navigate("/portfolio");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          `Failed to ${action.toLowerCase()} stock`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <Card className="flex space-x-4 max-w-md mx-auto px-6 py-8">
        <CardTitle className="text-xl font-semibold">
          Current Balance :{" "}
        </CardTitle>
        <CardDescription className="text-xl font-semibold">
          ${balance}
        </CardDescription>
      </Card>
      <Card className="max-w-md my-4 mx-auto">
        <CardHeader>
          <CardTitle>{action} Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Stock Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            <Input
              type="number"
              placeholder="Number of Shares"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              min="1"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : action}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const Buy = () => <TradeForm action="Buy" />;
export const Sell = () => <TradeForm action="Sell" />;

export default TradeForm;
