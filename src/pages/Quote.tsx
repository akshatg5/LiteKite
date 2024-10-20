import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import url from "@/lib/url";

interface SearchResult {
  name: string;
  symbol: string;
}

interface StockQuote {
  name ?: string;
  price ?: number;
  symbol ?: string;
}

const GetQuote: React.FC = () => {
  const [usSymbol, setUsSymbol] = useState("");
  const [usStockQuote, setUsStockQuote] = useState<StockQuote | null>(null);
  const [indianStockQuote, setIndianStockQuote] = useState<StockQuote | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [indianStock, setIndianStock] = useState("");
  const [searchRes, setSearchRes] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState<string>("");

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

  useEffect(() => {
    if (query.length > 0) {
      searchForStocks(query);
    }
  }, [query]);

  const handleGetQuote = async (isIndian: boolean) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const symbol = isIndian ? indianStock : usSymbol;
      const endpoint = isIndian ? "indianquote" : "quote";

      const res = await axios.post(
        `${url}/${endpoint}`,
        { symbol },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (isIndian) {
        setIndianStockQuote(res.data);
      } else {
        setUsStockQuote(res.data);
      }
      setError("");
    } catch (err) {
      if (isIndian) {
        setIndianStockQuote(null);
      } else {
        setUsStockQuote(null);
      }
      setError("Invalid symbol or error fetching quote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Get Indian Stock Quote</CardTitle>
          <CardDescription>
            Search for and select an Indian stock to get its current price
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Indian Stocks..."
            />
            {searchRes && searchRes.length > 0 && (
              <Card>
                <CardContent className="p-2">
                  {searchRes.map((item) => (
                    <div
                      key={item.symbol}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIndianStock(item.symbol.split(".")[0]);
                        setQuery(item.symbol.split(".")[0]);
                      }}
                    >
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.symbol.split(".")[0]}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            <Button
              onClick={() => handleGetQuote(true)}
              disabled={loading || !indianStock}
            >
              {loading ? "Loading..." : "Get Price"}
            </Button>
            {indianStockQuote && (
              <div>
                <p className="font-semibold">Name: {indianStockQuote?.symbol?.split('.')[0] || "NA"}</p>
                <p className="font-semibold">
                  Price: ₹{indianStockQuote.price}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Get US Stock Quote</CardTitle>
          <CardDescription>
            Enter a US stock symbol to get its current price
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              value={usSymbol}
              onChange={(e) => setUsSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., MSFT, AAPL)"
            />
            <Button onClick={() => handleGetQuote(false)} disabled={loading}>
              {loading ? "Loading..." : "Get Price"}
            </Button>
            {usStockQuote && (
              <div>
                <p className="font-semibold">Name: {usStockQuote.name}</p>
                <p className="font-semibold">Price: ${usStockQuote.price}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GetQuote;
