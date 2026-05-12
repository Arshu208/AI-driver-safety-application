import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // In a real app, you would call your API here.
    // For now, we mock a successful login to pass the ProtectedRoute.
    login(
      { id: '1', name: 'Demo Driver', email: email || 'driver@demo.com', role: 'DRIVER' },
      'mock_jwt_token_xyz'
    );
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue to RideSafe AI</p>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </GlassCard>

          <button
            onClick={() => navigate('/forgot-password')}
            className="text-primary text-sm"
          >
            Forgot password?
          </button>

          <Button fullWidth onClick={handleLogin}>
            Sign In
          </Button>

          <div className="text-center">
            <span className="text-muted-foreground text-sm">Don't have an account? </span>
            <button
              onClick={() => navigate('/signup')}
              className="text-primary text-sm"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
