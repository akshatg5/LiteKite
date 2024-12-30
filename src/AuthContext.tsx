import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import url from "./lib/url";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
  setAuthToken: (token: string) => void;
}

interface User {
  id: number;
  email: string;
  name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  //@ts-ignore
  const [token, setToken] = useState<string | null>(null);
  //@ts-ignore
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const setAuthToken = (accessToken: string) => {
    const bearerToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
    setToken(bearerToken);
    setIsAuthenticated(true);
    localStorage.setItem("token", bearerToken);
    axios.defaults.headers.common['Authorization'] = bearerToken;
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(`${url}/login`, { username, password });
      const { access_token } = res.data;
      setAuthToken(access_token);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await axios.get(`${url}/auth/google`, { withCredentials: true });
      if (response.data && response.data.auth_url) {
        window.location.href = response.data.auth_url;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error initiating Google authentication:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common['Authorization'];
  };

  const register = async (username: string, password: string) => {
    try {
      await axios.post(`${url}/register`, { username, password });
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        logout, 
        register, 
        handleGoogleAuth,
        setAuthToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const getAuthToken = () => localStorage.getItem("token");