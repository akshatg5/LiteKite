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
import url from "@/lib/url";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import BuyIndianStocks from "./BuyIndianStocks";
import SellIndianStocks from "./SellIndianStocks";

interface Holding {
  name: string;
  ticker: string;
  total_shares: number;
}

interface SearchResult {
  name: string;
  symbol: string;
}

const TradeForm = ({ action }: { action: "Buy" | "Sell" }) => {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [searchRes, setSearchRes] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [query, setQuery] = useState<string>("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStockSearch = async (query: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/ussearch?q=${query}&limit=5`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setSearchRes(res.data);
    } catch (e) {
      console.error("Unable to get the results from the search api.");
      setError("Unable to load the results for the search!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${url}/balance`, {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/${action.toLowerCase()}`,
        {
          symbol: action === "Sell" ? value : symbol,
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
          `Failed to ${action.toLowerCase()} stock`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getHoldings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/currentstocks`, {
        headers: {
          Authorization: token,
        },
      });
      setHoldings(res.data || []);
    } catch (error) {
      console.error("Cannot fetch the holdings", error);
      toast({
        title: "Error",
        description: "Unable to fetch holdings",
      });
      setHoldings([]);
    }
  };

  useEffect(() => {
    if (action === "Sell") {
      getHoldings();
    }
  }, [action]);

  
  useEffect(() => {
    if (query.length > 0) {
      handleStockSearch(query);
    }
  }, [query]);

  return (
    <div className="p-5">
      <Card className="flex space-x-4 max-w-md mx-auto px-6 py-8">
        <CardTitle className="text-xl font-semibold">
          Current US Balance :{" "}
        </CardTitle>
        <CardDescription className="text-xl font-semibold">
          ${balance.toFixed(2)}
        </CardDescription>
      </Card>
      <Card className="max-w-md my-4 mx-auto">
        <CardHeader>
          <CardTitle>{action} US Stock(s)</CardTitle>
          {error && <p className="text-red-600">{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {action === "Buy" && (
              <div>
                <div>
                  <Input
                    className="my-4"
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    placeholder="Search for US Stocks..."
                  />
                  {searchRes &&
                    Array.isArray(searchRes) &&
                    searchRes.map((item) => (
                      <Card
                        className="my-1 px-2 py-1 rounded-xl cursor-pointer"
                        onClick={() => {
                          setSymbol(item.symbol.split(".")[0]);
                          setQuery(item.symbol.split(".")[0]);
                        }}
                      >
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>
                          {item.symbol.split(".")[0]}
                        </CardDescription>
                      </Card>
                    ))}
                </div>
                <Input
                  className="my-4"
                  type="number"
                  placeholder="Number of Shares"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  min="1"
                />
              </div>
            )}
            {action === "Sell" && (
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {value
                        ? holdings.find((holding) => holding.ticker === value)
                            ?.name || "Select a stock..."
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
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === holding.ticker
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {holding.ticker} - Shares: {holding.total_shares}
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
                    holdings.find((holding) => holding.ticker === value)
                      ?.total_shares || 0
                  }
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || (action === "Sell" && !value)}
            >
              {loading ? "Loading..." : action}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const Buy = () => (
  <section className="">
    <TradeForm action="Buy" />
    <BuyIndianStocks />
  </section>
);
export const Sell = () => (
  <section>
    <TradeForm action="Sell" />
    <SellIndianStocks />
  </section>
);

export default TradeForm;
