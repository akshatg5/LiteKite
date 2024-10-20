import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import url from "@/lib/url";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  name: string;
  symbol: string;
}

export default function BuyIndianStocks() {
  const [symbol, setSymbol] = useState("");
  const [query, setQuery] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchRes, setSearchRes] = useState<SearchResult[]>([]);
  const [shares, setShares] = useState("");
  const navigate = useNavigate();

  const searchForStocks = async (query: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/indiansearch?q=${query}&limit=5`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setSearchRes(res.data);
    } catch (error) {
      console.error("Unable to get the results from the search api.");
      setError("Unable to load the results for the search!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/buyindianstock`,
        {
          symbol: symbol.split('.')[0],
          shares: parseInt(shares),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      toast({
        title: "Success",
        description: response.data.message,
      });
      navigate("/portfolioindia");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to buy stock`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      searchForStocks(query);
    }
  }, [query]);

  return (
    <Card className="max-w-md mx-auto px-6 mb-16 py-4">
      <CardTitle className="text-xl">Buy Indian Stock(s)</CardTitle>
      <div>
        <Input
          className="my-4"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          placeholder="Search for Indian Stocks..."
        />
        {searchRes &&
          Array.isArray(searchRes) &&
          searchRes.map((item) => (
            <Card
              className="my-1 px-2 py-1 rounded-xl cursor-pointer"
              onClick={() => {
                setSymbol(item.symbol.split('.')[0]);
                setQuery(item.symbol.split('.')[0]);
              }}
            >
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.symbol.split('.')[0]}</CardDescription>
            </Card>
          ))}
      </div>
      <div>
        <Input
          className="my-4"
          type="number"
          placeholder="Number of Shares"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          min="1"
        />
      </div>
      <div>
        <Button
          className="w-full"
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Buy"}
        </Button>
      </div>
      {error && <CardDescription>{error}</CardDescription>}
      {loading && <CardDescription>Loading...</CardDescription>}
    </Card>
  );
}
