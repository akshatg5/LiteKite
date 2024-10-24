import { useToast } from "@/hooks/use-toast";
import url from "@/lib/url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Holding {
  name: string;
  ticker: string;
  total_shares: number;
}

const SellDialog = ({
  stock,
  totalShares,
}: {
  stock: string;
  totalShares: number;
}) => {
  const [shares, setShares] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/sell`,
        { symbol: stock, shares: parseInt(shares) },
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
        description: error.response?.data?.message || "Failed to buy stock",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidStock = (stock: string) => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sell {stock}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell {stock}</DialogTitle>
          <DialogDescription>
            Enter the number of shares you want to Sell.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="shares" className="text-right">
                Shares
              </label>
              <Input
                id="shares"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                type="number"
                max={totalShares}
                className="col-span-3"
                placeholder="Enter number of shares"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Selling..." : `Sell ${stock}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SellDialog;
