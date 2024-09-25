import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const TradeForm = ({ action } : {action : any}) => {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:5000/api/${action.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ symbol, shares: parseInt(shares) })
      });
      if (!response.ok) throw new Error(`Failed to ${action.toLowerCase()} stock`);
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
      });
      navigate('/');
    } catch (error : any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{action} Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Stock Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
          <Input
            type="number"
            placeholder="Number of Shares"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            min="1"
          />
          <Button type="submit" className="w-full">{loading ? "Loading...": action}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const Buy = () => <TradeForm action="Buy" />;
export const Sell = () => <TradeForm action="Sell" />;