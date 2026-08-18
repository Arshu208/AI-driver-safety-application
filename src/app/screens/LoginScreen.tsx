import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { signInWithFaceLock } from '../../services/faceLock';

export default function LoginScreen() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [faceLockLoading, setFaceLockLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('/auth/login', { phone, password });
      login(response.data.user, response.data.token);
      
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceLock = async () => {
    try {
      setFaceLockLoading(true);
      setError('');
      await signInWithFaceLock(phone);
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Face Lock sign-in failed');
    } finally {
      setFaceLockLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 overflow-y-auto pb-24">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue to RideSafe AI</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
            className="text-primary text-sm font-bold"
          >
            Forgot password?
          </button>

          <Button fullWidth onClick={handleLogin} disabled={loading} className="mt-4">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Button fullWidth variant="ghost" onClick={handleFaceLock} disabled={faceLockLoading || !phone}>
            <span className="flex items-center justify-center gap-2"><Fingerprint className="h-5 w-5" />{faceLockLoading ? 'Checking Face Lock...' : 'Sign in with Face Lock'}</span>
          </Button>

          <div className="text-center mt-4">
            <span className="text-muted-foreground text-sm">Don't have an account? </span>
            <button
              onClick={() => navigate('/signup')}
              className="text-primary text-sm font-bold"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
