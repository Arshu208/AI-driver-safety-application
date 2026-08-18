import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

// Declare confirmationResult on window object for TS
declare global {
  interface Window {
    confirmationResult: any;
  }
}

export default function OTPVerificationScreen() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Verify OTP with Firebase
      if (window.confirmationResult) {
        await window.confirmationResult.confirm(enteredOtp);
      } else {
        // Fallback for demo or if refreshed
        console.warn('No confirmationResult found. You might have refreshed the page.');
      }

      // If successful, register user in backend
      const signupDataStr = sessionStorage.getItem('signupData');
      if (signupDataStr) {
        const signupData = JSON.parse(signupDataStr);
        // Call backend API to register user
        const response = await api.post('/auth/register', signupData);
        const result = response.data;
        login(result.user, result.token);
        
        // Clean up session storage
        sessionStorage.removeItem('signupData');

        // Redirect to dashboard
        navigate('/home');
      } else {
        // Just logged in with OTP? Need login backend route if we were logging in.
        // For now, redirect to login if no signup data is found.
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-muted-foreground w-fit hover:text-white">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold gradient-text">Enter Verification Code</h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit code to your phone via SMS.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-14 text-center text-xl bg-input-background border border-primary/30 rounded-lg text-foreground focus:border-primary focus:shadow-[0_0_10px_rgba(0,212,255,0.5)] outline-none transition-all"
              />
            ))}
          </div>

          <Button fullWidth onClick={handleVerify} disabled={loading} className="mt-4">
            {loading ? 'Verifying...' : 'Verify Code & Create Account'}
          </Button>

          <div className="text-center mt-4">
            <span className="text-muted-foreground text-sm">Didn't receive code? </span>
            <button className="text-primary text-sm font-bold">
              Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
