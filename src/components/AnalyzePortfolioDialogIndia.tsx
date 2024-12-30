import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { CardDescription } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface AnalyzePortfolioProps {
  total: number;
  stocks: {
    ticker: string;
    totalShares: number;
    avg_purchase_price: number;
    current_price: number;
    current_value: number;
    name: string;
  }[];
  cash: number;
}

interface AnalysisResult {
  portfolio_health: {
    diversification_score: string;
    risk_assessment: string;
    sector_balance: string;
  };
  stock_analysis: {
    [key: string]: {
      outlook: string;
      suggestion: string;
    };
  };
  recommendations: {
    immediate_actions: string[];
    rebalancing: string;
    cash_strategy: string;
  };
  market_context: {
    current_environment: string;
    opportunities: string[];
    risks: string[];
  };
}

const AnalyzePortfolioIndiaDialog: React.FC<AnalyzePortfolioProps> = ({
  total,
  stocks,
  cash,
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const transformedStocks = stocks.map(stock => ({
        ticker: stock.ticker,
        totalshares: stock.totalShares,
        avg_purcase_price: stock.avg_purchase_price,
        current_price: stock.current_price
      }));

      const response = await axios.post(
        "https://aisupport-five.vercel.app/api/portfolio-analyze",
        { total, stocks: transformedStocks, cash }
      );
      const parsedAnalysis: AnalysisResult = JSON.parse(response.data.analysis);
      setAnalysis(parsedAnalysis);
    } catch (error) {
      console.error("Unable to fetch analysis for portfolio.", error);
      setError("Analysis Failed. Please try again.");
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={analyzePortfolio} disabled={stocks.length === 0} className="text-xl font-bold">
          Analyze Portfolio    
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[950px] max-w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Portfolio Analysis</DialogTitle>
          <DialogDescription>
            Get a comprehensive analysis of your investment portfolio.
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
            {analysis && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Portfolio Health</h3>
                    <div className="bg-secondary p-4 rounded-lg">
                      <p><span className="font-semibold">Diversification Score:</span> {analysis.portfolio_health.diversification_score}</p>
                      <p><span className="font-semibold">Risk Assessment:</span> {analysis.portfolio_health.risk_assessment}</p>
                      <p><span className="font-semibold">Sector Balance:</span> {analysis.portfolio_health.sector_balance}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Stock Analysis</h3>
                    <div className="bg-secondary p-4 rounded-lg space-y-2">
                      {Object.entries(analysis.stock_analysis).map(([ticker, data]) => (
                        <div key={ticker} className="border-b border-primary-foreground/10 pb-2 last:border-b-0 last:pb-0">
                          <p className="font-semibold">{ticker}</p>
                          <p className="text-sm">{data.outlook} - {data.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Recommendations</h3>
                  <div className="bg-secondary p-4 rounded-lg space-y-4">
                    <div>
                      <p className="font-semibold">Immediate Actions:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.recommendations.immediate_actions.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                    <p><span className="font-semibold">Rebalancing:</span> {analysis.recommendations.rebalancing}</p>
                    <p><span className="font-semibold">Cash Strategy:</span> {analysis.recommendations.cash_strategy}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Market Context</h3>
                  <div className="bg-secondary p-4 rounded-lg space-y-4">
                    <p><span className="font-semibold">Current Environment:</span> {analysis.market_context.current_environment}</p>
                    <div>
                      <p className="font-semibold">Opportunities:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.market_context.opportunities.map((opportunity, index) => (
                          <li key={index}>{opportunity}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">Risks:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.market_context.risks.map((risk, index) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between border-t pt-4 mt-4">
          <CardDescription>Powered By Gemini</CardDescription>
        </DialogFooter>
        <DialogDescription>Beta phase</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default AnalyzePortfolioIndiaDialog;