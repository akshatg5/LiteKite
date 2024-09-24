import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Portfolio from './pages/Portfolio';
import { Buy, Sell } from './pages/Trade';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import History from './pages/History';
import GetQuote from './pages/Quote';

const ProtectedRoute = ({ children } : {children : React.ReactNode}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="container mx-auto p-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
                <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
                <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/quote" element={<ProtectedRoute><GetQuote /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;