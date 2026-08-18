import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Activity, 
  Camera, 
  Map, 
  Mic, 
  BarChart, 
  Zap, 
  Eye, 
  Navigation,
  Smartphone,
  ChevronRight,
  PlayCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b-0 border-white/5 mx-4 mt-4 rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-wider gradient-text">RideSafe AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#ai-demo" className="hover:text-primary transition-colors">AI Demo</a>
          <a href="#analytics" className="hover:text-primary transition-colors">Analytics</a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:flex hover:bg-white/5">
            Log In
          </Button>
          <Button onClick={() => navigate('/signup')} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary rounded-full px-6">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05)_0%,transparent_70%)]" />
        </div>

        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto px-4 z-10 text-center flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-primary/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary uppercase tracking-widest">v2.0 Live Now</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-tight"
          >
            The Future of <br className="hidden md:block" />
            <span className="gradient-text">Driver Safety</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            Real-time drowsiness detection, AI voice coaching, and predictive analytics. 
            Protecting lives with military-grade computer vision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button onClick={() => navigate('/signup')} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary rounded-full h-14 px-8 text-lg w-full sm:w-auto group">
              Start Monitoring
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg border-white/10 hover:bg-white/5 w-full sm:w-auto glass-card">
              <PlayCircle className="mr-2 w-5 h-5 text-primary" />
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* HUD Overlay Design */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* AI Features Grid */}
      <section id="features" className="py-32 relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powered by <span className="text-primary glow-primary">Advanced AI</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our neural networks analyze facial micro-expressions in real-time, detecting fatigue before you even feel it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Eye, title: "Micro-sleep Detection", desc: "Tracks blink rate and eye closure duration with 99% accuracy.", color: "primary" },
              { icon: Activity, title: "Emotion & Stress", desc: "Monitors facial tension to identify road rage and severe stress.", color: "secondary" },
              { icon: Map, title: "GPS Emergency", desc: "Auto-dispatches location to authorities upon collision detection.", color: "warning" },
              { icon: Mic, title: "Voice Coaching", desc: "Conversational AI agent keeping you engaged during long hauls.", color: "accent" },
              { icon: Smartphone, title: "Mobile PWA Ready", desc: "Transforms your smartphone into an enterprise-grade dashcam.", color: "success" },
              { icon: BarChart, title: "Fleet Analytics", desc: "Comprehensive dashboards for managers to monitor driver health.", color: "primary" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card border-white/5 hover:border-primary/30 transition-colors h-full bg-black/40 relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br from-var(--${feature.color})/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="p-8 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:glow-${feature.color} transition-all`}>
                      <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live AI Demo Section */}
      <section id="ai-demo" className="py-32 relative bg-black/50 border-y border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[2px] bg-primary/20 shadow-[0_0_20px_rgba(0,212,255,0.5)] opacity-50" />
        </div>
        
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur-xl opacity-30 animate-pulse" />
            <div className="relative glass-card rounded-[2rem] p-2 border border-white/10 overflow-hidden">
              <div className="aspect-[4/3] bg-zinc-900 rounded-3xl relative overflow-hidden">
                {/* Simulated Camera Feed */}
                <img 
                  src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop" 
                  alt="Driver"
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                />
                
                {/* AI HUD Overlay */}
                <div className="absolute inset-0 border-[4px] border-primary/20 rounded-3xl z-10" />
                
                {/* Face Mesh Simulation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border border-primary/50 rounded-[40%] bg-primary/10 z-20 flex items-center justify-center">
                  <div className="w-full h-[2px] bg-primary/80 absolute top-1/3 shadow-[0_0_10px_#00d4ff] animate-[scan_2s_ease-in-out_infinite]" />
                  
                  {/* Eye boxes */}
                  <div className="absolute top-1/3 left-6 w-10 h-6 border border-primary bg-primary/20 rounded-sm" />
                  <div className="absolute top-1/3 right-6 w-10 h-6 border border-primary bg-primary/20 rounded-sm" />
                </div>
                
                {/* Real-time stats HUD */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-30">
                  <div className="glass-card p-3 rounded-xl border-white/10 backdrop-blur-md">
                    <div className="text-xs text-primary font-mono mb-1">DROWSINESS SCORE</div>
                    <div className="text-3xl font-bold font-mono">12% <span className="text-success text-lg">SAFE</span></div>
                  </div>
                  <div className="glass-card p-3 rounded-xl border-white/10 backdrop-blur-md text-right">
                    <div className="text-xs text-secondary font-mono mb-1">BLINK RATE</div>
                    <div className="text-xl font-bold font-mono">14 / min</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Real-Time Edge Inference</h2>
            <p className="text-muted-foreground text-lg mb-8">
              No cloud latency. No privacy concerns. RideSafe AI runs 100% on your local device utilizing WebAssembly and WebGL to process 60 frames per second.
            </p>
            
            <ul className="space-y-6">
              {[
                { title: "Zero Latency", desc: "Instantaneous alerts within 50ms of micro-sleep detection." },
                { title: "Privacy First", desc: "Video streams never leave your device. Only metadata is synced." },
                { title: "Offline Mode", desc: "Fully functional AI detection even in remote areas without signal." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <Button onClick={() => navigate('/ai-monitoring-live')} className="mt-10 bg-white text-black hover:bg-gray-200 rounded-full px-8 py-6 h-auto text-lg font-bold">
              Try Live Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <div className="max-w-3xl mx-auto glass-card border-primary/20 p-12 rounded-[3rem] relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 blur-[100px] rounded-full" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/30 blur-[100px] rounded-full" />
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Ready to Upgrade Your Safety?</h2>
            <p className="text-xl text-muted-foreground mb-10 relative z-10">
              Join thousands of drivers and fleet operators using RideSafe AI to ensure everyone gets home safely.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button onClick={() => navigate('/signup')} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary rounded-full h-14 px-10 text-lg">
                Create Free Account
              </Button>
              <Button onClick={() => navigate('/fleet-dashboard')} variant="outline" size="lg" className="rounded-full h-14 px-10 text-lg border-white/20 glass-card hover:bg-white/10">
                Fleet Management
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 relative z-10 bg-black">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-wider">RideSafe AI</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 RideSafe AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
