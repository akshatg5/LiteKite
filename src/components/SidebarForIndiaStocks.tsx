import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Menu } from "lucide-react";
import axios from "axios";
import url from "@/lib/url";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { topIndianStocks } from "@/data/TopIndianStocksList";

interface Stock {
  ticker: string;
  name: string;
}

interface priceData {
  name: string;
  symbol: string;
  price: number;
}

export function SidebarForIndiaStocks({
  onToggle,
  onPortfolioUpdate,
}: {
  onToggle: (open: boolean) => void;
  onPortfolioUpdate: () => void;
}) {
  const [stocks, setStocks] = useState<Stock[]>(topIndianStocks);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [open, setOpen] = useState(true);
  const [shares, setShares] = useState<Record<string, string>>({});
  const [price, setPrice] = useState<priceData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStockSearch = async (query: string) => {
    if (!query) {
        setStocks(topIndianStocks);
        return
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/indiansearch?q=${query}&limit=5`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setStocks(res.data.map((item: { name: string; symbol: string }) => ({
        name: item.name,
        ticker: item.symbol,
      })));
    } catch (e) {
      console.error("Unable to get the results from the search api.");
      toast({
        title: "Unable to load the results for the search!",
        variant : "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        handleStockSearch(searchQuery)
    },300)
    return () => clearTimeout(delayDebounceFn)
},[searchQuery])

  const handleGetPrice = async (ticker: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${url}/indianquote`,
        {
          symbol: ticker.split('.')[0],
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setPrice(res.data);
    } catch (error) {
      console.error("Unable fetch the price for the stock!");
      toast({
        title: "Error",
        description: `Unable to fetch price of ${ticker}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (ticker: string) => {
    try {
        setLoading(true)
      const token = localStorage.getItem("token");
      if (!parseInt(shares[ticker])) {
        toast({
          title: "Share quantity should be > 1",
        });
      }
      await axios.post(
        `${url}/buyindianstock`,
        {
          symbol: ticker.split('.')[0],
          shares: parseInt(shares[ticker] || "0"),
        },
        {
          headers: { Authorization: token },
        }
      );
      toast({
        title: "Purchase Successful",
        description: `Bought ${shares[ticker]} shares of ${ticker}`,
      });
      setShares((prev) => ({ ...prev, [ticker]: "" }));
      onPortfolioUpdate();
    } catch (error : any) {
    console.log(error.response.data)
        toast({
          title: "Purchase Failed",
          description: error.response.data.error,
          variant: "destructive",
    })
    } finally {
        setLoading(false)
    }
  };

  const toggleSidebar = () => {
    setOpen(!open);
    onToggle(!open);
  };

  return (
    <>
      <Button
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 p-2 rounded-full shadow-md bg-primary text-primary-foreground transition-all duration-300 ease-in-out ${
          open ? "left-[25%] max-sm:left-[75%]" : "left-4 max-sm:left-2 max-sm:top-8"
        }`}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <div
        className={`fixed left-0 top-0 h-screen bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
          open ? "w-1/4 max-sm:w-3/4" : "w-0"
        }`}
      >
        <div className={`flex justify-center my-2 mx-1 ${open ? "" : "hidden"}`}>
          <Link to="/" className="text-xl font-bold">LiteKite</Link>
        </div>
        <div
          className={`flex justify-center items-center space-x-2 my-1 mx-1 ${
            open ? "" : "hidden"
          }`}
        >
          <Input
            type="search"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {loading && <Loader2 className="animate-spin" />}
        </div>
        <ScrollArea className="flex-grow">
          {stocks.map((stock) => (
            <div
              key={stock.ticker}
              className={`p-4 border-b border-border ${open ? "" : "hidden"}`}
            >
              <div className="font-bold flex justify-between">
                <h1>{stock.ticker.split('.')[0]}</h1>
                {stock.ticker == price?.symbol && (
                  <Badge>
                    <span className="text-xl animate-pulse">
                      LTP : ₹{price.price ? price.price : 0}
                    </span>
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{stock.name}</div>
              <div className="mt-2 flex space-x-2">
                <Input
                  type="number"
                  value={shares[stock.ticker] || ""}
                  onChange={(e) =>
                    setShares((prev) => ({
                      ...prev,
                      [stock.ticker]: e.target.value,
                    }))
                  }
                  placeholder="Shares"
                />
                <Button size="sm" onClick={() => handleGetPrice(stock.ticker)}>
                  {loading ? "Loading..." : "Get Price"}
                </Button>
                <Button size="sm" onClick={() => handleBuy(stock.ticker)}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Buy' }
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </>
  );
}
