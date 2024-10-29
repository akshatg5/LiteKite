import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { CardDescription } from "./ui/card";

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
  portfolio_health?: {
    diversification_score: string;
    risk_assessment: string;
    sector_balance: string;
  };
  stock_analysis?: {
    [key: string]: {
      outlook: string;
      suggestion: string;
    };
  };
  recommendations?: {
    immediate_actions: string[];
    rebalancing: string;
    cash_strategy: string;
  };
  market_context?: {
    current_environment: string;
    opportunities: string[];
    risks: string[];
  };
  error?: string;
  message?: string;
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
      // Transform the stocks data to match the expected payload
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
      setAnalysis(response.data);
      if (response.data.error) {
        setError(response.data.error);
      }
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
        <Button variant="outline" className="text-xl font-bold">Analyze Portfolio</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[950px] max-w-full max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Portfolio Analysis</DialogTitle>
          <DialogDescription>
            Get a comprehensive analysis of your investment portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {loading && (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Analyzing your portfolio...</span>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {analysis && !error && (
            <div className="space-y-4">
              {analysis.portfolio_health && (
                <div className="mb-4">
                  <h3 className="font-bold text-xl">Portfolio Health:</h3>
                  <p><b>Diversification Score</b>: {analysis.portfolio_health.diversification_score}</p>
                  <p><b>Risk Assessment</b>: {analysis.portfolio_health.risk_assessment}</p>
                  <p><b>Sector Balance</b>: {analysis.portfolio_health.sector_balance}</p>
                </div>
              )}
              {analysis.stock_analysis && (
                <div>
                  <h3 className="font-bold text-xl">Stock Analysis:</h3>
                  {Object.entries(analysis.stock_analysis).map(([ticker, data]) => (
                    <div key={ticker}>
                      <p><b>{ticker}</b>: {data.outlook} - {data.suggestion}</p>
                    </div>
                  ))}
                </div>
              )}
              {analysis.recommendations && (
                <div>
                  <h3 className="font-bold text-xl">Recommendations:</h3>
                  <p className="font-semibold">Immediate Actions:</p>
                  <ul>
                    {analysis.recommendations.immediate_actions.map((action, index) => (
                      <li key={index}>{index + 1}. {action}</li>
                    ))}
                  </ul>
                  <p><b>Rebalancing</b>: {analysis.recommendations.rebalancing}</p>
                  <p><b>Cash Strategy</b>: {analysis.recommendations.cash_strategy}</p>
                </div>
              )}
              {analysis.market_context && (
                <div>
                  <h3 className="font-bold text-xl">Market Context:</h3>
                  <p><b>Current Environment</b>: {analysis.market_context.current_environment}</p>
                  <p className="font-bold">Opportunities:</p>
                  <ul>
                    {analysis.market_context.opportunities.map((opportunity, index) => (
                      <li key={index}>{index + 1}. {opportunity}</li>
                    ))}
                  </ul>
                  <p className="font-bold">Risks:</p>
                  <ul>
                    {analysis.market_context.risks.map((risk, index) => (
                      <li key={index}>{index + 1}. {risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <CardDescription>Powered By Gemini</CardDescription>
          <Button onClick={analyzePortfolio} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Portfolio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyzePortfolioIndiaDialog;