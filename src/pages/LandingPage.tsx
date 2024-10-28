import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Star, Users, Shield, Loader2, TrendingUp, DollarSign, BarChart2, Globe } from "lucide-react"
import { useAuth } from "@/AuthContext"
import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export default function LandingPage() {
  const { handleGoogleAuth } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await handleGoogleAuth()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login with Google",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-purple-500 to-orange-500">
      <nav className="flex justify-between items-center p-6">
        <div className="text-white text-2xl font-bold">LiteKite</div>
        <div className="flex space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:text-gray-700">
              Sign in
            </Button>
          </Link>
          <Link to="/register">
            <Button onClick={handleGoogleAuth} variant="secondary">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-20">
          <motion.h1 
            className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-200"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Explore the investor in yourself with Litekite.
          </motion.h1>
          <motion.p 
            className="text-xl text-white mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            An all in one mock stock exchange platform,allowing you to trade just like the real world,without real money,{" "}
            <span className="font-bold underline">powered by Gemini API.</span>
          </motion.p>
          <motion.div
            className="my-4 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="text-3xl font-bold text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Start Your Trading Journey Today!
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={handleGoogleSignIn}
                  className="bg-white my-2 text-purple-600 hover:bg-gray-100 hover:text-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Getting Started</span>
                    </>
                  ) : (
                    "Start Trading Now"
                  )}
                </Button>
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-400 mr-2" />
                <h2 className="text-3xl font-bold text-white">
                  Master Stock Trading
                </h2>
              </div>
              <p className="text-gray-100 mb-4">
                New to stock trading? Get hands-on experience with our mock-stock
                exchange and AI-powered insights.
              </p>
              <img
                src="/portfolio.png"
                alt="Stock Trading Dashboard"
                className="w-full h-60 object-cover rounded-md mb-4"
              />
              <Link to="/buy">
                <Button variant="secondary" className="w-full">
                  Start Trading
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <BarChart2 className="w-8 h-8 text-blue-400 mr-2" />
                <h2 className="text-3xl font-bold text-white">
                  Track Your Success
                </h2>
              </div>
              <p className="text-gray-200 mb-4">
                Monitor your performance with our comprehensive transaction
                history and portfolio analysis tools.
              </p>
              <img
                src="/history.png"
                alt="Transaction History"
                className="w-full h-60 object-cover rounded-md mb-4"
              />
              <Link to="/history">
                <Button variant="secondary" className="w-full">
                  View History
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-yellow-400 mr-2" />
                <h2 className="text-3xl font-bold text-white">
                  Global Market Access
                </h2>
              </div>
              <p className="text-gray-200 mb-4">
                Invest in India or USA markets. LiteKite supports both, with
                AI-powered analysis to guide your decisions.
              </p>
              <img
                src="/trade.png"
                alt="Global Markets"
                className="w-full h-60 object-cover rounded-md mb-4"
              />
              <Link to="/portfolio">
                <Button variant="secondary" className="w-full">
                  Explore Markets
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="w-8 h-8 text-purple-400 mr-2" />
                <h2 className="text-3xl font-bold text-white">
                  Smart Stock Research
                </h2>
              </div>
              <p className="text-gray-200 mb-4">
                Get detailed overviews of stock fundamentals and recent news,
                powered by advanced AI analysis.
              </p>
              <img
                src="/quote.png"
                alt="Stock Research"
                className="w-full h-60 object-cover rounded-md mb-4"
              />
              <Link to="/quote">
                <Button variant="secondary" className="w-full">
                  Research Stocks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="text-white mb-20">
          <h2 className="text-5xl font-bold text-center mb-10">
            Why Choose LiteKite?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Star className="w-16 h-16 mb-4 text-yellow-300" />
              <h3 className="text-2xl font-semibold mb-2">
                AI-Powered Insights
              </h3>
              <p>
                Leverage the power of Gemini API for advanced stock analysis and
                predictions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="w-16 h-16 mb-4 text-blue-300" />
              <h3 className="text-2xl font-semibold mb-2">
                User-Friendly Interface
              </h3>
              <p>
                Intuitive design makes stock trading accessible for beginners
                and pros alike.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-16 h-16 mb-4 text-green-300" />
              <h3 className="text-2xl font-semibold mb-2">
                Safe Learning Environment
              </h3>
              <p>
                Practice trading with our mock exchange without risking real
                money.
              </p>
            </div>
          </div>
        </section>

        <section className="text-white mb-20">
          <h2 className="text-5xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Sign Up", description: "Create your account in minutes." },
              { step: 2, title: "Fund Your Account", description: "Add virtual funds to start trading." },
              { step: 3, title: "Research Stocks", description: "Use our AI-powered tools to analyze stocks." },
              { step: 4, title: "Start Trading", description: "Buy and sell stocks with confidence." }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold text-2xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-white">
        <div className="container mx-auto px-6">
          <p>&copy; 2024 LiteKite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}