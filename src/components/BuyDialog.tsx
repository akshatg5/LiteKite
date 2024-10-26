import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import url from "@/lib/url"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import sp500stocks from "@/lib/Stocks.json"

interface BuyDialogProps {
  stock: string
  onComplete: () => void
}

const BuyDialog: React.FC<BuyDialogProps> = ({ stock, onComplete }) => {
  const [shares, setShares] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidStock(stock) || !shares || parseInt(shares) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of shares.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${url}/buy`,
        { symbol: stock, shares: parseInt(shares) },
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
      setOpen(false)
      onComplete()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to buy stock",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isValidStock = (symbol: string) => {
    return sp500stocks.some((s) => s.symbol === symbol)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Buy {stock}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy {stock}</DialogTitle>
          <DialogDescription>
            Enter the number of shares you want to buy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="shares" className="text-right">
                Shares
              </label>
              <Input
                id="shares"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                type="number"
                min="1"
                className="col-span-3"
                placeholder="Enter number of shares"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Buying..." : `Buy ${stock}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default BuyDialog