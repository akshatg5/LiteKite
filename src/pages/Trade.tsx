import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import url from "@/lib/url"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import sp500stocks from "@/lib/Stocks.json"

interface Holding {
  name: string
  ticker: string
  total_shares: number
}

interface Stock {
  symbol: string
  name: string
}

const TradeForm = ({ action }: { action: "Buy" | "Sell" }) => {
  const [symbol, setSymbol] = useState("")
  const [shares, setShares] = useState("")
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState(0)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [filteredStocks,setFilteredStocks] = useState<Stock[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleStockSearch = (input : string) => {
    const filtered = sp500stocks.filter(
      (stock) => stock.symbol.toLowerCase().includes(input.toLowerCase()) || stock.name.toLowerCase().includes(input.toLowerCase())
    )
    setFilteredStocks(filtered)
  }

  useEffect(() => {
    const getBalance = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${url}/balance`, {
          headers: {
            Authorization: token,
          },
        })
        setBalance(res.data.balance)
      } catch (error) {
        console.error("Error fetching balance:", error)
        toast({
          title: "Error",
          description: "Failed to fetch balance",
          variant: "destructive",
        })
      }
    }
    getBalance()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${url}/${action.toLowerCase()}`,
        { symbol: action === "Sell" ? value : symbol, shares: parseInt(shares) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      )
      toast({
        title: "Success",
        description: response.data.message,
      })
      navigate("/portfolio")
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          `Failed to ${action.toLowerCase()} stock`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getHoldings = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${url}/currentstocks`, {
        headers: {
          Authorization: token,
        },
      })
      setHoldings(res.data || [])
    } catch (error) {
      console.error("Cannot fetch the holdings", error)
      toast({
        title: "Error",
        description: "Unable to fetch holdings",
      })
      setHoldings([])
    }
  }

  useEffect(() => {
    if (action === "Sell") {
      getHoldings()
    }
  }, [action])

  return (
    <div className="p-5">
      <Card className="flex space-x-4 max-w-md mx-auto px-6 py-8">
        <CardTitle className="text-xl font-semibold">Current Balance : </CardTitle>
        <CardDescription className="text-xl font-semibold">${balance.toFixed(2)}</CardDescription>
      </Card>
      <Card className="max-w-md my-4 mx-auto">
        <CardHeader>
          <CardTitle>{action} Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
          {action === "Buy" && (
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {symbol
                        ? sp500stocks.find((stock) => stock.symbol === symbol)?.name
                        : "Select a stock..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search stocks..." onValueChange={handleStockSearch} />
                      <CommandList>
                        <CommandEmpty>No stocks found!</CommandEmpty>
                        <CommandGroup>
                          {filteredStocks.map((stock) => (
                            <CommandItem
                              key={stock.symbol}
                              value={stock.symbol}
                              onSelect={(currentValue) => {
                                setSymbol(currentValue === symbol ? "" : currentValue)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  symbol === stock.symbol ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {stock.symbol} - {stock.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  className="my-4"
                  type="number"
                  placeholder="Number of Shares"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  min="1"
                />
              </div>
            )}
            {action === "Sell" && (
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {value
                        ? holdings.find((holding) => holding.ticker === value)?.name || "Select a stock..."
                        : "Select a stock..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search stocks..." />
                      <CommandList>
                        <CommandEmpty>No stocks found!</CommandEmpty>
                        <CommandGroup>
                          {holdings.map((holding) => (
                            <CommandItem
                              key={holding.ticker}
                              value={holding.ticker}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === holding.ticker ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {holding.ticker} - Shares: {holding.total_shares}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  className="my-4"
                  type="number"
                  placeholder="Number of Shares"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  min="1"
                  max={holdings.find((holding) => holding.ticker === value)?.total_shares || 0}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading || (action === "Sell" && !value)}>
              {loading ? "Loading..." : action}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div>
      <p className="text-center text-neutral-500">Currently, we only support US stocks. Coming soon with Indian Stocks!</p>
      </div>
    </div>
  )
}

export const Buy = () => <TradeForm action="Buy" />
export const Sell = () => <TradeForm action="Sell" />

export default TradeForm