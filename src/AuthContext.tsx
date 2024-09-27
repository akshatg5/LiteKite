import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import url from "./lib/url";

interface AuthContextType {
  isAuthenticated: boolean; // Corrected type to boolean
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  //@ts-ignore
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(`${url}/login`, { username, password });
      const accessToken = res.data.access_token;
      setToken(accessToken);
      setIsAuthenticated(true);
      localStorage.setItem("token", `Bearer ${accessToken}`);
    } catch (error) {
      console.error("Error logging in, try again!", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  const register = async (username: string, password: string) => {
    try {
      await axios.post(`${url}/register`, { username, password });
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be inside an Auth Provider");
  }
  return context;
};
