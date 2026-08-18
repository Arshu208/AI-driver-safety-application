import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Phone, Car, HeartPulse } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function SignupScreen() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enableFaceLock, setEnableFaceLock] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleNumber: '',
    emergencyContact: ''
  });

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!formData.phone || !formData.name || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      const response = await api.post('/auth/register', formData);
      login(response.data.user, response.data.token);
      navigate(enableFaceLock ? '/face-lock-setup' : '/home');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to create account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 overflow-y-auto pb-24">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-8 mt-10">
          <h1 className="mb-2 text-2xl font-bold gradient-text">Create Account</h1>
          <p className="text-muted-foreground">Create your driver profile and start monitoring safely.</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Full name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <input type="checkbox" checked={enableFaceLock} onChange={(e) => setEnableFaceLock(e.target.checked)} className="mt-1 h-4 w-4 accent-primary" />
            <span><span className="block text-sm font-semibold">Enable Face Lock after signup</span><span className="text-xs text-muted-foreground">Use Windows Hello, Face ID, or your device passkey for faster sign-in.</span></span>
          </label>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <input
                type="tel"
                placeholder="Phone number (e.g. +1234567890) *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password *"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

          <GlassCard>
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Vehicle details (e.g. Tesla Model 3)"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <HeartPulse className="w-5 h-5 text-primary" />
              <input
                type="tel"
                placeholder="Emergency Contact Phone"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <Button fullWidth onClick={handleSignup} disabled={loading} className="mt-6">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <div className="text-center mt-6">
            <span className="text-muted-foreground text-sm">Already have an account? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-primary text-sm font-bold"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
