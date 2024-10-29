import { useState, useEffect, useMemo} from "react";
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
import { Link, useNavigate } from "react-router-dom";
import url from "@/lib/url";
import { InteractiveStockChart } from "@/components/Graph";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Info,
} from "lucide-react";
import AnalyzeDialog from "@/components/AnalayzeDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import BuyDialog from "@/components/BuyDialog";
// import StockActionsDropdown from "@/components/StockActionsDropdown";
import UsFlag from '@/assets/united-states-flag-icon.svg'
import AnalayzePortfolioDialog from "@/components/AnalyzePortfolioDialog";

interface PortfolioStock {
  ticker: string;
  totalshares: number;
  avg_purcase_price: number;
  current_price: number;
  current_value: number;
}

interface Portfolio {
  stocks: PortfolioStock[];
  cash: number;
  total: number;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  //@ts-ignore
  const [symbol, setSymbol] = useState("");
  const [isChartOpen,setIsChartOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(
    portfolio?.stocks[0]?.ticker || "AAPL"
  );
  const { toast } = useToast();
  const navigate = useNavigate();
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
        description: "Failed to fetch portfolio. Please sign in again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [toast, navigate]);

  const { totalInvestment, totalCurrentValue, totalPnL } = useMemo(() => {
    if (!portfolio)
      return { totalInvestment: 0, totalCurrentValue: 0, totalPnL: 0 };
    const totalInvestment = portfolio.stocks.reduce(
      (sum, stock) => sum + stock.avg_purcase_price * stock.totalshares,
      0
    );
    const totalCurrentValue = portfolio.stocks.reduce(
      (sum, stock) => sum + stock.current_value,
      0
    );
    const totalPnL = totalCurrentValue - totalInvestment;

    return { totalInvestment, totalCurrentValue, totalPnL };
  }, [portfolio]);

  const getPnlClass = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-500";
  };

  const handleStockClick = (ticker : string) => {
    setSelectedStock(ticker)
    setIsChartOpen(true)
  }

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
      <div className="flex flex-col justify-center items-center min-h-screen min-w-screen mx-auto">
        <img src={UsFlag} className="w-24 h-24" />
        Loading...
      </div>
    );

  const PortfolioCard = ({ stock }: { stock: PortfolioStock }) => {
    const pnl =
      stock.current_value - stock.avg_purcase_price * stock.totalshares;
    const netPercentChange = calculateNetChange(
      stock.current_value,
      stock.avg_purcase_price,
      stock.totalshares
    );

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-bold">{stock.ticker}</h3>
                <p className="text-sm">{stock.totalshares} shares</p>
              </div>
              <div>
                <Link to={`/info/${stock.ticker}`}>
                  <Info />
                </Link>
              </div>
            </div>
            <Button
              variant={selectedStock === stock.ticker ? "secondary" : "ghost"}
              onClick={() => handleStockClick(stock.ticker)}
              className="text-sm"
            >
              View Chart
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p>LTP: ${stock.current_price.toFixed(2)}</p>
              <p>Value: ${stock.current_value.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className={getPnlClass(pnl)}>P&L: ${pnl.toFixed(2)}</p>
              <p className={getPnlClass(netPercentChange)}>
                Net Chg: {netPercentChange.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="mt-2">
            <AnalyzeDialog
              stock={stock.ticker}
              avg_price={stock.avg_purcase_price}
              ltp={stock.current_price}
              shares={stock.totalshares}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const MobilePortfolio = () => {
    return (
      <div className="md:hidden my-4">
        {portfolio.stocks.map((stock) => (
          <PortfolioCard key={stock.ticker} stock={stock} />
        ))}
      </div>
    );
  };

  const DesktopPortfolio = () => {
    return (
      <div className="hidden md:block">
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
              const pnl =
                stock.current_value -
                stock.avg_purcase_price * stock.totalshares;
              const netPercentChange = calculateNetChange(
                stock.current_value,
                stock.avg_purcase_price,
                stock.totalshares
              );
              return (
                <TableRow key={stock.ticker}>
                  <TableCell className="flex items-center space-x-2">
                    <Button
                      variant={
                        selectedStock === stock.ticker ? "secondary" : "ghost"
                      }
                      onClick={() => handleStockClick(stock.ticker)}
                      className="w-full justify-start"
                    >
                      {stock.ticker}
                    </Button>
                    <Link to={`/info/${stock.ticker}`}>
                      <Info width={20} height={20} />
                    </Link>
                  {/* <StockActionsDropdown stock={stock.ticker} totalShares={stock.totalshares} onActionComplete={handleActionComplete} /> */}
                  </TableCell>
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
                  <TableCell>
                    <AnalyzeDialog
                      stock={stock.ticker}
                      avg_price={stock.avg_purcase_price}
                      ltp={stock.current_price}
                      shares={stock.totalshares}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-5">
      <Card className="mx-2 mb-4 mt-2">
        <CardHeader>
          <CardTitle className="text-4xl max-sm:text-md font-semibold flex justify-between">
            Holdings
            <img src={UsFlag} className="w-20 h-20" alt="US Flag" />
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Investment</p>
              <h2 className="text-2xl font-bold">
                ${totalInvestment.toFixed(2)}
              </h2>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <h2 className="text-2xl font-bold">
                ${totalCurrentValue.toFixed(2)}
              </h2>
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <h2 className={`text-2xl font-bold ${getPnlClass(totalPnL)}`}>
                ${totalPnL.toFixed(2)} (
                {((totalPnL / totalInvestment) * 100).toFixed(2)}%)
              </h2>
            </div>
          </div>
          <div className="flex gap-4 justify-between">
            <div className="flex space-x-5">
            <div>
              <p className="text-sm text-muted-foreground">Cash Balance</p>
              <p className="text-lg font-semibold">
                ${portfolio.cash.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Account Value
              </p>
              <p className="text-lg font-semibold">
                ${portfolio.total.toFixed(2)}
              </p>
            </div>
            </div>
          <AnalayzePortfolioDialog cash={portfolio.cash} total={portfolio.total} stocks={portfolio.stocks || []} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <MobilePortfolio />
          <DesktopPortfolio />
          {portfolio.stocks.length === 0 && (
            <div className="flex justify-center items-center">
              No stocks traded yet!
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="flex space-x-2 px-4 py-2 mb-10">
          <AlertCircle color="red"/>
          <p>Click on any stock to get the daily chart!</p>
        </Card>

      <Dialog open={isChartOpen} onOpenChange={setIsChartOpen}>
        <DialogContent className="max-w-7xl max-sm:max-w-8xl w-full h-[90vh]">
          <DialogHeader>
            <DialogTitle>Stock Chart: {selectedStock}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <InteractiveStockChart ticker={selectedStock} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;
