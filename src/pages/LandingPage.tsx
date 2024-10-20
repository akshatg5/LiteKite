import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Star, Users, Shield} from "lucide-react"

export default function LandingPage() {
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
            <Button variant="secondary">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-200">
            LiteKite
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Your all-in-one platform for buying and selling stocks, tracking your portfolio, all{" "}
            <span className="font-bold underline">powered by Gemini API.</span>
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700">
              Get Started
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Buy & Sell Stocks</h2>
              <p className="text-gray-100 mb-4">
                New to stock trading? Get your hands dirty on the mock-stock exchange.
              </p>
              <img
                src="/trade.png"
                alt="Transaction History"
                className="w-full h-60 object-fill rounded-md mb-4"
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
              <h2 className="text-2xl font-bold text-white mb-4">Transaction History</h2>
              <p className="text-gray-200 mb-4">
                Keep track of all your trades with our comprehensive transaction history feature.
              </p>
              <img
                src="/history.png"
                alt="Transaction History"
                className="w-full h-60 object-fit rounded-md mb-4"
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
              <h2 className="text-2xl font-bold text-white mb-4">India and US Markets</h2>
              <p className="text-gray-200 mb-4">
                Learn to invest in India or USA, Litekite supports both the markets. Analyze your investments using AI!
              </p>
              <img
                src="/portfolio.png"
                alt="Interactive Portfolio"
                className="w-full h-60 object-fit rounded-md mb-4"
              />
              <Link to="/portfolio">
                <Button variant="secondary" className="w-full">
                  Explore Portfolio
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Comprehensive Stock Research Tool (Coming soon for Indian stocks!)
              </h2>
              <p className="text-gray-200 mb-4">
                Get a detailed overview of the fundamentals and recent news related to a stock!
              </p>
              <img src="/quote.png" alt="Get Quote" className="w-full h-60 object-fill rounded-md mb-4" />
              <Link to="/quote">
                <Button variant="secondary" className="w-full">
                  Explore Stocks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="text-white mb-20">
          <h2 className="text-4xl font-bold text-center mb-10">Why Choose LiteKite?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Star className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p>Leverage the power of Gemini API for advanced stock analysis and predictions.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">User-Friendly Interface</h3>
              <p>Intuitive design makes stock trading accessible for beginners and pros alike.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safe Learning Environment</h3>
              <p>Practice trading with our mock exchange without risking real money.</p>
            </div>
          </div>
        </section>

        <section className="text-white mb-20">
          <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p>Create your account in minutes.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Fund Your Account</h3>
              <p>Add virtual funds to start trading.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Research Stocks</h3>
              <p>Use our AI-powered tools to analyze stocks.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold text-xl mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Trading</h3>
              <p>Buy and sell stocks with confidence.</p>
            </div>
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