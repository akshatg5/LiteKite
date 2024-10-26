import { useState, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, TrendingUp } from "lucide-react";
import BuyDialog from "@/components/BuyDialog";
import SellDialog from "@/components/SellDialog";

interface StockActionsDropDownProps {
  stock: string;
  totalShares: number;
  onActionComplete: () => void;
}

const StockActionsDropdown = ({ stock, totalShares, onActionComplete }: StockActionsDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleActionComplete = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      onActionComplete();
    }, 500);
  }, [onActionComplete]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <TrendingUp className="h-4 w-4 text-green-500" />
          <BuyDialog 
            stock={stock} 
            onComplete={handleActionComplete}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <TrendingUp className="h-4 w-4 text-red-500" />
          <SellDialog 
            stock={stock} 
            totalShares={totalShares} 
            onComplete={handleActionComplete}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StockActionsDropdown;