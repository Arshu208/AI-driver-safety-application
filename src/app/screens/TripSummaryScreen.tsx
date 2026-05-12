import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, MapPin, Clock, Gauge, Shield, Eye, Download, Share2, AlertOctagon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';
import { api } from '../../services/api';

export default function TripSummaryScreen() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // We use demo-trip-id which is hardcoded in our telemetry pipeline for this MVP
        const res = await api.get('/trips/demo-trip-id/summary');
        setTripData(res.data);
      } catch (e) {
        console.error(e);
        setTripData({
          durationMinutes: 45,
          metrics: { safetyScore: 96, maxFatigue: 28, totalAlerts: 2, criticalAlerts: 0 },
          telemetry: [
            { time: '10:00', fatigue: 5 }, { time: '10:10', fatigue: 15 },
            { time: '10:20', fatigue: 28 }, { time: '10:30', fatigue: 12 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Summary...</div>;

  return (
    <div className="min-h-screen p-6 pb-24">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center glow-success mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="mb-2">Trip Completed!</h1>
          <p className="text-muted-foreground text-sm">Great driving session</p>
        </div>
      </motion.div>

      <GlassCard glow="success" className="mb-6">
        <div className="text-center mb-4">
          <h2 className="text-4xl text-success mb-2">{tripData.metrics.safetyScore}</h2>
          <p className="text-sm text-muted-foreground">Final Safety Score</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm mb-1">{tripData.durationMinutes}m</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <AlertOctagon className="w-4 h-4 text-accent" />
            </div>
            <p className="text-sm mb-1">{tripData.metrics.criticalAlerts}</p>
            <p className="text-xs text-muted-foreground">Critical Alerts</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-4 h-4 text-success" />
            </div>
            <p className="text-sm mb-1">{tripData.metrics.maxFatigue}%</p>
            <p className="text-xs text-muted-foreground">Peak Fatigue</p>
          </div>
        </div>
      </GlassCard>
      
      <div className="mb-6">
        <GlassCard>
          <h4 className="mb-4 text-sm">Fatigue Timeline</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tripData.telemetry}>
                <defs>
                  <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{backgroundColor: '#1E1E1E', border: 'none'}} />
                <Area type="monotone" dataKey="fatigue" stroke="#f43f5e" fillOpacity={1} fill="url(#colorFatigue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Trip Details</h3>
      </div>

      <div className="space-y-3 mb-6">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm">Safety Performance</span>
            </div>
            <span className="text-sm text-success">{tripData.metrics.safetyScore >= 90 ? 'Excellent' : tripData.metrics.safetyScore >= 75 ? 'Good' : 'Needs Improvement'}</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-warning" />
              <span className="text-sm">Avg Fatigue Level</span>
            </div>
            <span className="text-sm text-warning">{tripData.metrics.averageFatigue}%</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center">
                <span className="text-xs text-warning">{tripData.metrics.totalAlerts}</span>
              </div>
              <span className="text-sm">Total Safety Alerts</span>
            </div>
            <span className="text-sm text-muted-foreground">{tripData.metrics.totalAlerts} warnings</span>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Achievements</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <GlassCard className="bg-primary/5 border border-primary/30">
          <div className="text-center">
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-xs text-muted-foreground">Safe Driver</p>
          </div>
        </GlassCard>

        <GlassCard className="bg-success/5 border border-success/30">
          <div className="text-center">
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-xs text-muted-foreground">Long Distance</p>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" onClick={() => {}}>
            <span className="flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </span>
          </Button>
          <Button variant="ghost" onClick={() => {}}>
            <span className="flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </span>
          </Button>
        </div>

        <Button fullWidth onClick={() => navigate('/home')}>
          Return to Home
        </Button>
      </div>
    </div>
  );
}
