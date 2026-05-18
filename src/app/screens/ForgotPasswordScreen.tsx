import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    navigate('/otp-verification');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <button onClick={() => navigate('/login')} className="mb-8 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="mb-2">Forgot Password?</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a code to reset your password.
          </p>
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

          <Button fullWidth onClick={handleResetPassword}>
            Send Reset Code
          </Button>
        </div>
      </div>
    </div>
  );
}
