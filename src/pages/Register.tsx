'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail } from 'lucide-react'
import { motion } from "framer-motion";
import history from "@/assets/History.png"
import SuggestStocks from '@/assets/SuggestStocks.png'
import usPortfolio from "@/assets/UsPortfolio.png"
import IndianPortfolio from '@/assets/indiaPortfolio.png'
import { FocusCards } from '@/components/ui/focus-cards'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleGoogleAuth } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }
    try {
      setLoading(true)
      await register(username, password)
      navigate('/login')
      toast({
        title: "Success",
        description: "Registration successful. Please log in.",
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Registration failed"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      title: "Transactions History",
      src: history
    },
    {
      title: "Tap into American markets",
      src: usPortfolio
    },
    {
      title: "Invest and track Indian markets",
      src: IndianPortfolio
    },
    {
      title: "Get AI suggestions to buy stocks according to your portfolio!",
      src: SuggestStocks
    }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left half - Financial Data Heatmap */}
       {/* Left half - Focus Cards */}
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 p-4 lg:p-8 flex items-center justify-center"
      >
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Discover Our Features</h2>
          <FocusCards cards={cards} />
        </div>
      </motion.div>

      {/* Right half - Registration Form */}
      <div className="w-1/2 p-8 flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>Create an account to access our financial services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {loading ? 'Registering...' : "Register"}
              </Button>
            </form>
            <div className="mt-4">
              <Button onClick={handleGoogleAuth} variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" /> Register with Google
              </Button>
            </div>
            <p className="text-center text-sm mt-4">
              Already have an account?{' '}
              <Link className="text-primary hover:underline font-semibold" to="/login">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}