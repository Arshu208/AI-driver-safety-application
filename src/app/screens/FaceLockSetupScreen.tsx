import { useState } from 'react';
import { Fingerprint, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { enrollFaceLock } from '../../services/faceLock';

export default function FaceLockSetupScreen() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    try {
      setLoading(true);
      setStatus('Follow your browser security prompt to enroll Face Lock.');
      await enrollFaceLock();
      setStatus('Face Lock is active on this device.');
    } catch (error: any) {
      setStatus(error.response?.data?.message || error.message || 'Face Lock enrollment was cancelled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <GlassCard className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Fingerprint className="h-10 w-10" />
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Account Security</p>
          <h1 className="mb-3 text-3xl font-bold">Enable Face Lock</h1>
          <p className="mx-auto mb-8 max-w-md text-muted-foreground">Use your device security prompt, such as Windows Hello or Face ID. RideSafe stores only the public passkey, never a face image.</p>
          {status && <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">{status}</div>}
          <div className="mb-8 flex items-center gap-3 rounded-xl bg-success/10 p-4 text-left text-sm text-success"><ShieldCheck className="h-5 w-5 shrink-0" /> Your biometric data stays with your device.</div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button fullWidth onClick={handleEnroll} disabled={loading}>{loading ? 'Waiting for device...' : 'Enable Face Lock'}</Button>
            <Button fullWidth variant="ghost" onClick={() => navigate('/home')}>Skip for now</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
