import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from './theme-provider';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const showBar = location.pathname !== '/';

  if (!showBar) {
    return null;
  }

  return (
    <nav className="bg-transparent border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">LiteKite</Link>
          </div>
          <div className="flex items-center">
            <Link to="/portfolio" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">Portfolio</Link>
            <Link to="/buy" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">Buy</Link>
            <Link to="/sell" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">Sell</Link>
            <Link to="/history" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">History</Link>
            <Link to="/quote" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">Quote</Link>
            <Link to="/profile" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">Profile</Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;