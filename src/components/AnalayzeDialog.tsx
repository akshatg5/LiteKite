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
import { Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
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

interface AnalysisData {
  pros: { [key: string]: string };
  cons: { [key: string]: string };
  suggestion: string;
}

const AnalyzeDialog: React.FC<AnalyzeDialogProps> = ({ stock, avg_price, shares, ltp }) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
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

      const response = await axios.post<{ analysis: string }>(`https://aisupport-five.vercel.app/api/analyze`, payload);
      
      // Parse the analysis string into an object
      const parsedAnalysis: AnalysisData = JSON.parse(response.data.analysis);
      setAnalysis(parsedAnalysis);
    } catch (error) {
      console.error("Unable to analyze the given stock", error);
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

  const renderAnalysisSection = (title: string, items: { [key: string]: string } | undefined, icon: React.ReactNode) => {
    if (!items) return null;
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          {Object.values(items).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={analyzeStock}>Analyze {stock}</Button>
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
                {renderAnalysisSection("Pros", analysis.pros, <CheckCircle2 className="h-5 w-5 text-green-500" />)}
                {renderAnalysisSection("Cons", analysis.cons, <XCircle className="h-5 w-5 text-red-500" />)}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Suggestion</h3>
                  <p className="text-muted-foreground">{analysis.suggestion}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between border-t pt-4 mt-4">
          <CardDescription>Powered By Gemini</CardDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyzeDialog;

