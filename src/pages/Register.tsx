import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading,setLoading] = useState(false)
    const { register } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
  
    const handleSubmit = async (e:any) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
      try {
        setLoading(true)
        await register(username, password);
        navigate('/login');
        toast({
          title: "Success",
          description: "Registration successful. Please log in.",
        });
      } catch (error:any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false)
      }
    };
  
    return (
      <Card className="max-w-md mx-auto mt-6">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e:any) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e:any) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e:any) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">{loading ? 'Loading...' : "Register"}</Button>
          </form>
        <CardDescription className="text-center text-md mt-4">Already have an account? <Link className="underline font-semibold" to={'/login'}>Login</Link></CardDescription>
        </CardContent>
      </Card>
    );
  };