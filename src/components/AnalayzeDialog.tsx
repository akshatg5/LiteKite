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
import { Loader2 } from "lucide-react";
import axios from "axios";
import url from "@/lib/url";

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
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   throw new Error("Authentication token not found. Please log in again.");
      // }

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
        <Button variant="outline">Analyze {stock}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Analyzing {stock}</DialogTitle>
          <DialogDescription>
            Analysis of your investment in {stock}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {loading && (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {analysis && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Pros:</h3>
                <ul className="list-disc pl-5">
                  {Object.values(analysis.pros).map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Cons:</h3>
                <ul className="list-disc pl-5">
                  {Object.values(analysis.cons).map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Suggestion:</h3>
                <p>{analysis.suggestion}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={analyzeStock} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyzeDialog;