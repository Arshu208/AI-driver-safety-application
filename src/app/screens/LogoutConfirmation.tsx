import { useNavigate } from 'react-router-dom';
import { LogOut, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';

export default function LogoutConfirmation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <GlassCard className="mb-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-warning/20 flex items-center justify-center mb-6">
              <LogOut className="w-10 h-10 text-warning" />
            </div>

            <h1 className="mb-3">Sign Out</h1>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to sign out of your account?
            </p>

            <GlassCard className="bg-warning/5 border border-warning/30 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                <div className="flex-1 text-left">
                  <p className="text-sm mb-1">Before you go</p>
                  <p className="text-xs text-muted-foreground">
                    Make sure all your active trips are ended and data is synced.
                  </p>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-3">
              <Button fullWidth variant="danger" onClick={handleLogout}>
                Yes, Sign Out
              </Button>
              <Button fullWidth variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </GlassCard>

        <div className="text-center text-xs text-muted-foreground">
          <p>You can always sign back in anytime</p>
        </div>
      </motion.div>
    </div>
  );
}
