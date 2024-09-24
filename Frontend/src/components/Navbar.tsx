import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "@/components/theme-provider"

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  //@ts-ignore
  const { theme,setTheme } = useTheme()

  return (
    <nav className="bg-secondary mb-4">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Finance App</Link>
        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium">Portfolio</Link>
            <Link to="/buy" className="text-sm font-medium">Buy</Link>
            <Link to="/sell" className="text-sm font-medium">Sell</Link>
            <Link to="/history" className="text-sm font-medium">History</Link>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;