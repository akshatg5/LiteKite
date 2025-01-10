import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleloading, setGoogleLoading] = useState(false);
  const { login, handleGoogleAuth, setAuthToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      setAuthToken(token);
      navigate('/portfolio');
    } else if (error) {
      toast({
        title: "Error",
        description: "Failed to login with Google",
        variant: "destructive",
      });
    }
  }, [location, setAuthToken, navigate, toast]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await handleGoogleAuth();
    } catch (error) {
      setGoogleLoading(false);
      toast({
        title: "Error",
        description: "Failed to initiate Google login",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(username, password);
      navigate("/portfolio");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast({
          title: "Error",
          description: "Invalid username or password!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:"Please try again!",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md flex justify-center flex-col mx-auto mt-5">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
        <Button
          onClick={handleGoogleSignIn}
          className="w-full my-2"
          onLoad={() => setLoading(true)}
        >
         {googleloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting to Google...
            </>
          ) : (
            <>
              <Mail className="mr-2" />
              Login with Google
            </>
          )}
        </Button>
        <CardDescription className="text-center text-md mt-4">
          Don't have an account?{" "}
          <Link className="underline font-semibold" to={"/register"}>
            Register
          </Link>
        </CardDescription>
      </CardContent>
    </Card>
  );
};