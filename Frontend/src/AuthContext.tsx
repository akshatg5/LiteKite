import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated : true,
    login : (username : string,password :string) => Promise<void>;
    logout : () => void;
    register : (username:string,password : string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider : React.FC<{children : React.ReactNode}> = ({children}) => {
    const [isAuthenticated,setIsAuthenticated] = useState<boolean>(false);
    const [token,setToken] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        setIsAuthenticated(!!token)
    },[])

    const login = async (username:string,password :string) => {
        try {
            const res = await axios.post("http://127.0.0.1:5000/api/login",{username,password});
            const accessToken = res.data.access_token
            setToken(accessToken)
            setIsAuthenticated(true)
            localStorage.setItem("token",`Bearer ${accessToken}`)
        } catch (error) {
            console.error("Error loggin in try again!",error)
            throw error
        }
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      };

     const register = async (username: string, password: string) => {
    try {
      await axios.post("http://127.0.0.1:5000/api/register", { username, password });
        
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  };

    return (
        <AuthContext.Provider value={{isAuthenticated,login,logout,register}} >
                {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context == undefined) {
        throw new Error("useAuth must be inside an Auth Provider")
    }
    return context
}