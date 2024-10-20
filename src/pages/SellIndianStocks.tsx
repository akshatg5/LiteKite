import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import url from "@/lib/url";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Holding {
  name: string;
  ticker: string;
  total_shares: number;
}

export default function SellIndianStocks() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [shares, setShares] = useState("");
  const navigate = useNavigate()

  const fetchCurrentIndianHoldings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/currentindianstocks`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      setHoldings(res.data);
    } catch (e) {
      console.error("Unable to fetch the current holdings for the user");
      toast({
        title: "Error",
        description: "Unable to fetch holdings",
      });
      setError("Unable to fetch current holdings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentIndianHoldings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/sellindianstock`,
        {
          symbol: value,
          shares: parseInt(shares),
        },
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
          `Failed to Sell stock`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="max-w-md mx-auto px-6 mb-16 py-4">
      <CardTitle className="my-2">Selling Indian Stocks</CardTitle>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? holdings.find((holding) => holding.ticker === value)?.name ||
                "Select a stock..."
              : "Select a stock..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search stocks..." />
            <CommandList>
              <CommandEmpty>No stocks found!</CommandEmpty>
              <CommandGroup>
                {holdings.map((holding) => (
                  <CommandItem
                    key={holding.ticker}
                    value={holding.ticker}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === holding.ticker ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {holding.ticker.split('.')[0]} - Shares: {holding.total_shares}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        className="my-4"
        type="number"
        placeholder="Number of Shares"
        value={shares}
        onChange={(e) => setShares(e.target.value)}
        min="1"
        max={
          holdings.find((holding) => holding.ticker === value)?.total_shares ||
          0
        }
      />
      <Button
              type="submit"
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sell"}
            </Button>
            {error && <div className="text-red-700">{error}</div>}
    </Card>
  );
}
