import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { CardDescription } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface SuggestStocksProps {
  total: number;
  stocks: {
    ticker: string;
    totalshares: number;
    avg_purcase_price: number;
    current_price: number;
  }[];
  cash: number;
}

interface SuggestionResult {
  existing_holdings: {
    advice: string;
  };
  portfolio_analysis: {
    investment_style: string;
    risk_profile: string;
    sector_exposure: {
      [sector: string]: string;
    };
  };
  recommendations: {
    [key: string]: {
      investment_duration: string;
      name: string;
      reason: string;
      sector: string;
      suggested_allocation: string;
      ticker: string;
    };
  };
}

const SuggestStocks: React.FC<SuggestStocksProps> = ({
  total,
  stocks,
  cash,
}) => {
  const [suggestion, setSuggestion] = useState<SuggestionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://aisupport-five.vercel.app/api/suggest-stocks",
        { total, stocks, cash }
      );
      if (response.data && Object.keys(response.data).length > 0) {
        setSuggestion(response.data);
      } else {
        throw new Error("Empty or invalid response received");
      }
    } catch (error) {
      console.error("Unable to fetch analysis for portfolio.", error);
      setError(error instanceof Error ? error.message : "Analysis Failed. Please try again.");
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSuggestion(null);
    setError(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xl font-bold">
          Suggest Stocks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[950px] max-w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Stock recommendations</DialogTitle>
          <DialogDescription>
            Get a comprehensive list of stock where you can deploy your remaining cash, curated by Gemini according to your current portfolio and risk appetite.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span className="text-lg">Analyzing your portfolio...</span>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {suggestion && (
              <>
                <div className="flex flex-col md:flex-col max-sm:flex-col gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Existing Holdings Advice</h3>
                    <div className="bg-secondary p-4 rounded-lg">
                      <p>{suggestion.existing_holdings.advice}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Portfolio Analysis</h3>
                    <div className="bg-secondary p-4 rounded-lg">
                      <p><span className="font-semibold">Risk profile:</span> {suggestion.portfolio_analysis.risk_profile}</p>
                      <p><span className="font-semibold">Investment Style:</span> {suggestion.portfolio_analysis.investment_style}</p>
                      <p><span className="font-semibold">Sector Exposure:</span></p>
                      <ul className="list-disc list-inside pl-4">
                        {Object.entries(suggestion.portfolio_analysis.sector_exposure).map(([sector, exposure]) => (
                          <li key={sector}>{sector}: {exposure}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Stock Suggestions</h3>
                    <div className="bg-secondary p-4 rounded-lg space-y-2">
                      {Object.entries(suggestion.recommendations).map(([key, data]) => (
                        <div key={key} className="border-b border-primary-foreground/10 pb-2 last:border-b-0 last:pb-0">
                          <p className="font-semibold">{data.ticker}</p>
                          <p className="text-sm">{data.name}</p>
                          <p className="text-sm">{data.sector}</p>
                          <p className="text-sm"><b>Reason: </b> {data.reason}</p>
                          <p className="text-sm"> <b>Suggested Allocation:</b> {data.suggested_allocation}</p>
                          <p className="text-sm"> <b> Investment Duration:</b> {data.investment_duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between border-t pt-4 mt-4">
          <CardDescription>Powered By Gemini</CardDescription>
          <div className="space-x-2">
            <Button onClick={clearResults} variant="outline" disabled={loading || (!suggestion && !error)}>
              Clear Results
            </Button>
            <Button onClick={analyzePortfolio} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Suggest Stocks"
              )}
            </Button>
          </div>
        </DialogFooter>
        <DialogDescription>Beta phase</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestStocks;