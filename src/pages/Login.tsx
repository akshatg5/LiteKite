import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/portfolio");
    } catch (error: any) {
      console.log(error)
      if (error.status == 401) {
        toast({
          title: "Error",
          description: "Invalid username or password!",
          variant: "destructive",
        });
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-5">
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
            Login
          </Button>
        </form>
        <CardDescription className="text-center text-md mt-4">Don't have an account? <Link className="underline font-semibold" to={'/register'}>Register</Link></CardDescription>
      </CardContent>
    </Card>
  );
};
