import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import url from "@/lib/url";
import { InteractiveStockChart } from "@/components/Graph";
import { Button } from "@/components/ui/button";
import sp500stocks from "@/lib/Stocks.json";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Stock {
  symbol: string;
  name: string;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<{
    stocks: any[];
    cash: number;
    total: number;
  } | null>(null);
  const [symbol, setSymbol] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);

  const handleStockSearch = (input: string) => {
    const filtered = sp500stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(input.toLowerCase()) ||
        stock.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${url}/portfolio`, {
          headers: {
            Authorization: token,
          },
        });
        setPortfolio(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
        if (error.response) {
          console.error("Error response:", error.response.data);
        } else {
          console.error("Error:", error);
        }
        toast({
          title: "Error",
          description: "Failed to fetch portfolio. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchPortfolio();
  }, [toast, navigate]);

  const getPnlClass = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-500";
  };

  const calculateNetChange = (
    currentValue: number,
    avg_purcase_price: number,
    totalshares: number
  ) => {
    const purchaseValue = totalshares * avg_purcase_price;
    const changePercent =
      ((currentValue - purchaseValue) / purchaseValue) * 100;
    return changePercent;
  };

  if (!portfolio)
    return (
      <div className="flex justify-center items-center min-h-screen min-w-screen mx-auto">
        Loading...
      </div>
    );

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
                const pnl =
                  stock.current_value -
                  stock.avg_purcase_price * stock.totalshares;
                const netPercentChange = calculateNetChange(
                  stock.current_value,
                  stock.avg_purcase_price,
                  stock.totalshares
                );
                return (
                  <TableRow className="py-2" key={stock.ticker}>
                    <Button
                      variant={
                        selectedStock == stock.ticker ? "secondary" : "ghost"
                      }
                      onClick={() => setSelectedStock(stock.ticker)}
                      className="w-full justify-start"
                    >
                      <TableCell className="font-medium ">
                        {stock.ticker}
                      </TableCell>
                    </Button>
                    <TableCell>{stock.totalshares}</TableCell>
                    <TableCell>${stock.avg_purcase_price.toFixed(2)}</TableCell>
                    <TableCell>${stock.current_price.toFixed(2)}</TableCell>
                    <TableCell>${stock.current_value.toFixed(2)}</TableCell>
                    <TableCell className={getPnlClass(pnl)}>
                      ${pnl.toFixed(2)}
                    </TableCell>
                    <TableCell className={getPnlClass(netPercentChange)}>
                      {netPercentChange.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {portfolio.stocks.length === 0 && (
            <div className="flex justify-center items-center">
              No stocks traded yet!
            </div>
          )}
        </CardContent>
      </Card>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        <p className="text-neutral-700 text-sm sm:text-base font-medium">
          Click on the instrument to get the graph of that stock or search:
        </p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <span className="truncate">
                {symbol
                  ? sp500stocks.find((stock) => stock.symbol === symbol)?.name
                  : "Select a stock..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command className="w-full">
              <div className="flex items-center border-b px-3">
                <CommandInput
                  placeholder="Search stocks..."
                  onValueChange={handleStockSearch}
                  className="flex-1"
                />
              </div>
              <CommandList>
                <CommandEmpty>No stocks found!</CommandEmpty>
                <CommandGroup>
                  {filteredStocks.map((stock) => (
                    <CommandItem
                      key={stock.symbol}
                      value={stock.symbol}
                      onSelect={(currentValue) => {
                        setSelectedStock(
                          currentValue === symbol ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            symbol === stock.symbol
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span className="font-medium">{stock.symbol}</span>
                      </div>
                      <span className="text-sm text-neutral-500 truncate max-w-[200px]">
                        {stock.name}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {selectedStock && (
        <div>
          <InteractiveStockChart ticker={selectedStock} />
        </div>
      )}
      <Card>
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
      <p className="text-center text-neutral-500 mt-2">
        Currently, we only support US stocks. Coming soon with Indian Stocks!
      </p>
    </div>
  );
};

export default Portfolio;
