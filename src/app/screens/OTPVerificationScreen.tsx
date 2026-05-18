import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

export default function OTPVerificationScreen() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

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

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '123456') {
      navigate('/create-profile');
    } else {
      alert("Invalid OTP! Use 123456 for this demo.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8 text-center">
          <h1 className="mb-2">Enter Verification Code</h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit code to your email.<br/>
            <span className="text-primary font-bold">(Demo OTP: 123456)</span>
          </p>
        </div>

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
                className="w-12 h-14 text-center text-xl bg-input-background border border-primary/30 rounded-lg text-foreground focus:border-primary focus:glow-primary outline-none"
              />
            ))}
          </div>

          <Button fullWidth onClick={handleVerify}>
            Verify Code
          </Button>

          <div className="text-center">
            <span className="text-muted-foreground text-sm">Didn't receive code? </span>
            <button className="text-primary text-sm">
              Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
