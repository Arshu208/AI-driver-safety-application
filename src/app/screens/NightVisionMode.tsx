import { useState } from 'react';
import { Moon, Camera, AlertTriangle, ScanLine, Sun } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function NightVisionMode() {
  const [isNightModeActive, setIsNightModeActive] = useState(true);

  return (
    <div className={`min-h-screen p-6 pb-24 transition-colors duration-1000 ${isNightModeActive ? 'bg-black text-green-400' : 'bg-background text-foreground'}`}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isNightModeActive ? 'text-green-500' : 'gradient-text'}`}>
            Night Vision
          </h1>
          <p className={`text-sm ${isNightModeActive ? 'text-green-700' : 'text-muted-foreground'}`}>
            Low-light infrared detection
          </p>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsNightModeActive(!isNightModeActive)}
          className={`rounded-full ${isNightModeActive ? 'border-green-600 hover:bg-green-900/50 text-green-500' : ''}`}
        >
          {isNightModeActive ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border glass-card group"
           style={{ borderColor: isNightModeActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.1)' }}>
        
        <img 
          src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop" 
          alt="Night Vision Feed" 
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isNightModeActive 
              ? 'sepia-[.8] hue-rotate-[70deg] saturate-[3] brightness-[0.8] contrast-[1.5] mix-blend-screen opacity-90' 
              : 'opacity-50'
          }`}
        />
        
        {isNightModeActive && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Scanline effect */}
            <div className="w-full h-[2px] bg-green-500/50 absolute top-0 animate-[scan_3s_linear_infinite]" />
            <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] opacity-50" />
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />
          </div>
        )}
        
        {/* Face tracking mesh overlay */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 border rounded-[40%] flex items-center justify-center ${
          isNightModeActive ? 'border-green-500/50 bg-green-500/10' : 'border-primary/50 bg-primary/10'
        }`}>
          <ScanLine className={`w-8 h-8 ${isNightModeActive ? 'text-green-500 animate-pulse' : 'text-primary'}`} />
        </div>
        
        <div className="absolute top-4 left-4 flex gap-2">
          <div className={`px-2 py-1 rounded text-xs font-mono border backdrop-blur-md ${
            isNightModeActive ? 'border-green-500/50 text-green-500 bg-black/60' : 'border-white/10 text-white bg-black/60'
          }`}>
            REC
          </div>
          <div className={`px-2 py-1 rounded text-xs font-mono border backdrop-blur-md ${
            isNightModeActive ? 'border-green-500/50 text-green-500 bg-black/60' : 'border-white/10 text-white bg-black/60'
          }`}>
            IR-ACTIVE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className={`glass-card bg-black/60 backdrop-blur-xl ${isNightModeActive ? 'border-green-900' : 'border-white/10'}`}>
          <CardContent className="p-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
              isNightModeActive ? 'bg-green-900/50 text-green-500' : 'bg-primary/20 text-primary'
            }`}>
              <Camera className="w-5 h-5" />
            </div>
            <h3 className={`font-bold ${isNightModeActive ? 'text-green-400' : ''}`}>Enhancement</h3>
            <p className={`text-xs mt-1 ${isNightModeActive ? 'text-green-700' : 'text-muted-foreground'}`}>AI low-light filter active</p>
          </CardContent>
        </Card>

        <Card className={`glass-card bg-black/60 backdrop-blur-xl ${isNightModeActive ? 'border-green-900' : 'border-white/10'}`}>
          <CardContent className="p-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
              isNightModeActive ? 'bg-green-900/50 text-green-500' : 'bg-warning/20 text-warning'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className={`font-bold ${isNightModeActive ? 'text-green-400' : ''}`}>Visibility</h3>
            <p className={`text-xs mt-1 ${isNightModeActive ? 'text-green-700' : 'text-muted-foreground'}`}>Tracking eye movements</p>
          </CardContent>
        </Card>
      </div>
      
      <div className={`p-4 rounded-xl border ${isNightModeActive ? 'border-green-900 bg-green-900/10' : 'border-white/5 glass-card'}`}>
        <h3 className={`font-bold mb-2 ${isNightModeActive ? 'text-green-500' : ''}`}>System Status</h3>
        <ul className={`space-y-2 text-sm ${isNightModeActive ? 'text-green-600' : 'text-muted-foreground'}`}>
          <li className="flex justify-between">
            <span>Infrared Sensors</span>
            <span className={isNightModeActive ? 'text-green-400' : 'text-foreground'}>Online</span>
          </li>
          <li className="flex justify-between">
            <span>Thermal Noise Reduction</span>
            <span className={isNightModeActive ? 'text-green-400' : 'text-foreground'}>Active</span>
          </li>
          <li className="flex justify-between">
            <span>Pupil Dilation Tracking</span>
            <span className={isNightModeActive ? 'text-green-400' : 'text-foreground'}>Optimized</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
