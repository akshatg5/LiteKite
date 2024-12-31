import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from './theme-provider'
import { useAuth } from '@/AuthContext'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const {isAuthenticated} = useAuth()

  const showBar = location.pathname !== '/'
  if (!showBar) {
    return null
  }

  const handleLogOut = () => {
    localStorage.removeItem("token")
    navigate('/')
  }

  const navItems = [
    { to: "/portfolio", label: "Portfolio ( USA )" },
    { to: "/portfolioindia", label: "Portfolio ( India )" },
    { to: "/buy", label: "Buy" },
    { to: "/sell", label: "Sell" },
    { to: "/history", label: "History" },
    { to: "/quote", label: "Quote" },
    { to: "/profile", label: "Profile" },
  ]

  const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => (
    <Link
      to={to}
      className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent"
      onClick={onClick}
    >
      {label}
    </Link>
  )

  const MobileNavbar = () => (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <Link to="/" className="text-xl font-bold">LiteKite</Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col sm:px-3">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} onClick={() => setIsOpen(false)} />
          ))}
          <div className="flex space-x-2 mt-2">
          <Button onClick={handleLogOut} className="flex-1">Logout</Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="flex-shrink-0"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  const DesktopNavbar = () => (
    <div className="hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">LiteKite</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? navItems.map((item) => (
              <NavLink key={item.to} to={item.to} label={item.label} />
            )) : 
            <div className='flex space-x-2'>
            <Link to={'/login'} >
              <Button>
                Sign In
                </Button>
              </Link>
            <Link to={'/register'} >
              <Button>
                Sign Up
                </Button>
              </Link>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <nav className="bg-background border-b">
      <MobileNavbar />
      <DesktopNavbar />
    </nav>
  )
}

export default Navbar