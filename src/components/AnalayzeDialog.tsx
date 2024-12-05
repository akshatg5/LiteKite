import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CardDescription } from "@/components/ui/card";
import axios from "axios";

interface AnalyzeDialogProps {
  stock: string;
  avg_price: number;
  shares: number;
  ltp: number;
}

interface AnalysisResult {
  pros: { [key: string]: string };
  cons: { [key: string]: string };
  suggestion: string;
}

const AnalyzeDialog: React.FC<AnalyzeDialogProps> = ({ stock, avg_price, shares, ltp }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateInput = () => {
    if (!stock || avg_price <= 0 || shares <= 0 || ltp <= 0) {
      throw new Error("All fields must be filled with valid values.");
    }
  };

  const analyzeStock = async () => {
    setLoading(true);
    setError(null);
    try {
      validateInput();
      const payload = {
        symbol: stock,
        avg_price,
        shares,
        ltp
      };

      const response = await axios.post<AnalysisResult>(`https://aisupport-five.vercel.app/api/analyze`, payload);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Unable to analyze the given stock", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        console.error("Response headers:", error.response?.headers);
      }
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled>Analyze {stock}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[950px] max-w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Analyzing {stock}</DialogTitle>
          <DialogDescription>
            Analysis of your investment in {stock}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span className="text-lg">Analyzing {stock}...</span>
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
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Pros</h3>
                  <div className="bg-secondary p-4 rounded-lg">
                    <ul className="list-disc pl-5 space-y-2">
                      {Object.values(analysis.pros).map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Cons</h3>
                  <div className="bg-secondary p-4 rounded-lg">
                    <ul className="list-disc pl-5 space-y-2">
                      {Object.values(analysis.cons).map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Suggestion</h3>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p>{analysis.suggestion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between border-t pt-4 mt-4">
          <CardDescription>Powered By Gemini</CardDescription>
          <Button onClick={analyzeStock} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyzeDialog;