import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  BarChart2,
  PieChart,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import heroImg from "@/assets/HeroImg2.png";

export default function LandingPage() {
  const { handleGoogleAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await handleGoogleAuth();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-400 via-purple-500 to-orange-500">
      <nav className="flex justify-between items-center p-6">
        <div className="text-white text-2xl font-bold">Litekite</div>
        <div className="flex space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:text-gray-200">
              Sign in
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-2">
        <div className="flex justify-center items-center mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <img
              src={heroImg}
              className="rounded-2xl w-[60%] h-1/2 max-sm:w-[95%] max-sm:h-3/4 mx-auto shadow-white shadow-xl"
            />
          </motion.div>
        </div>
        <div className="flex lg:flex-col items-center gap-12 mb-10">
          <motion.div
            className="flex-1 text-center lg:text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl lg:text-5xl max-w-5xl font-bold mb-6 text-white max-sm:text-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              All in one Mock-stock exchange.
              Trade without real money.
            </motion.h1>
            <motion.p
              className="text-xl text-center mx-auto text-gray-100 mb-4 max-w-2xl max-sm:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              A free online platform to trade stocks, learn how to invest, get AI support and much more...
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link to={'/login'}>
              <Button
                size="lg"
                className="bg-white text-center mx-auto text-purple-600 hover:bg-gray-100 hover:text-purple-700"
                >
                {loading ? "Loading..." : "Sign up for free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
                  </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.section
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[
            {
              icon: <LineChart className="h-8 w-8" />,
              title: "100+",
              description: "Active Users",
            },
            {
              icon: <BarChart2 className="h-8 w-8" />,
              title: "500+",
              description: "Daily Trades",
            },
            {
              icon: <PieChart className="h-8 w-8" />,
              title: "2",
              description: "Capital markets",
            },
            {
              icon: <TrendingUp className="h-8 w-8" />,
              title: "24/7",
              description: "Market Access",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.icon}
              <h3 className="text-3xl font-bold mt-4">{item.title}</h3>
              <p className="text-gray-200">{item.description}</p>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          className="text-center mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-12">
            Start investing in minutes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Quick and secure sign up process",
              },
              {
                step: "2",
                title: "Fund Account",
                description: "Multiple payment options available",
              },
              {
                step: "3",
                title: "Start Trading",
                description: "Access to global markets",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-200">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className="py-8 text-center text-white">
        <div className="container mx-auto px-6">
          <p>&copy; 2024 Litekite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
