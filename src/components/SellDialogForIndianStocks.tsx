import { useToast } from "@/hooks/use-toast"
import url from "@/lib/url"
import axios from "axios"
import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface SellDialogProps {
  stock: string
  totalShares: number
  onComplete: () => void
}

const SellDialogForIndianStocks: React.FC<SellDialogProps> = ({ stock, totalShares, onComplete }) => {
  const [shares, setShares] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shares || parseInt(shares) <= 0 || parseInt(shares) > totalShares) {
      toast({
        title: "Error",
        description: "Please enter a valid number of shares to sell.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${url}/sellindianstock`,
        { symbol: stock.split('.')[0], shares: parseInt(shares) },
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
        description: error.response?.data?.message || "Failed to sell stock",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sell {stock}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell {stock}</DialogTitle>
          <DialogDescription>
            Enter the number of shares you want to sell.
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
                max={totalShares}
                className="col-span-3"
                placeholder="Enter number of shares"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Selling..." : `Sell ${stock}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SellDialogForIndianStocks;