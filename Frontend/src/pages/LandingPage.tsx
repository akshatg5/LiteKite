import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-purple-500 to-orange-500">
      <nav className="flex justify-between items-center p-6">
        <div className="text-white text-2xl font-bold">LiteKite</div>

        <div className="flex space-x-4">
            <Link to={'/login'}>
          <Button variant="ghost" className="text-white hover:text-gray-700">
            Sign in
          </Button>
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
            Your all-in-one platform for buying and selling stocks, tracking
            your portfolio, and managing your finances.
          </p>
          <Link to={'/login'}>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700"
            >
            Get Started
          </Button>
              </Link>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Buy & Sell Stocks
              </h2>
              <p className="text-gray-200 mb-4">
                Easily trade stocks with our intuitive platform. 
              </p>
              <img
                src="/trade.png"
                alt="Transaction History"
                className="w-full h-60 object-fill rounded-md mb-4"
              />
              <Link to={'/buy'}>
              <Button variant="secondary" className="w-full">
                Start Trading
              </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Transaction History
              </h2>
              <p className="text-gray-200 mb-4">
                Keep track of all your trades with our comprehensive transaction
                history feature.
              </p>
              <img
                src="/history.png"
                alt="Transaction History"
                className="w-full h-60 object-cover rounded-md mb-4"
              />
              <Link to={"/history"}>
                <Button variant="secondary" className="w-full">
                  View History
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Interactive Portfolio
              </h2>
              <p className="text-gray-200 mb-4">
                Visualize your investments and track your performance with our
                interactive portfolio tool.
              </p>
              <img
                src="/portfolio.png"
                alt="Interactive Portfolio"
                className="w-full h-60 object-fill rounded-md mb-4"
              />
              <Link to={'/portfolio'}>
              <Button variant="secondary" className="w-full">
                Explore Portfolio
              </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Stock Details
              </h2>
              <p className="text-gray-200 mb-4">
                Get prices and stock details about stocks on your radar!
              </p>
              <img
                src="/quote.png"
                alt="Get Quote"
                className="w-full h-60 object-fill rounded-md mb-4"
              />
              <Link to={'/quote'}>
              <Button variant="secondary" className="w-full">
                Explore Stocks
              </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-20 py-8 text-center text-white">
        <p>&copy; 2023 LiteKite. All rights reserved.</p>
      </footer>
    </div>
  );
}
