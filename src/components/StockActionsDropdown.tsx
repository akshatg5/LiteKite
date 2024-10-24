import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, TrendingUp} from "lucide-react";
import BuyDialog from "@/components/BuyDialog";
import SellDialog from "./SellDialog";

const StockActionsDropdown = ({ stock,totalShares } : {stock : string,totalShares:number}) => {
  return (
    <DropdownMenu>
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
          onSelect={(e) => e.preventDefault()}
        >
          <TrendingUp className="h-4 w-4 text-green-500" />
          <BuyDialog stock={stock} />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <TrendingUp className="h-4 w-4 text-green-500" />
          <SellDialog stock={stock} totalShares={totalShares} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StockActionsDropdown;