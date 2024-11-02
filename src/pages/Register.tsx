import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail } from 'lucide-react';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register,handleGoogleAuth } = useAuth();
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
        setLoading(true);
        await register(username, password);
        navigate('/login');
        toast({
          title: "Success",
          description: "Registration successful. Please log in.",
        });
      } catch (error:any) {
        // Handle the error response from the API
        const errorMessage = error.response?.data?.error || error.message || "Registration failed";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
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
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">{loading ? 'Loading...' : "Register"}</Button>
          </form>
          <Button onClick={handleGoogleAuth}  className="w-full my-2">
            <Mail className='mx-2' /> Register with Google
          </Button>
          <CardDescription className="text-center text-md mt-4">
            Already have an account? <Link className="underline font-semibold" to={'/login'}>Login</Link>
          </CardDescription>
        </CardContent>
      </Card>
    );
};