import { useState } from 'react';
import { Send, Brain, User } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

export default function AISafetyCoachChatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I\'m your AI Safety Coach. I can help you improve your driving safety, answer questions about your fatigue levels, and provide personalized recommendations. How can I assist you today?' },
    { role: 'user', text: 'How am I doing today?' },
    { role: 'ai', text: 'You\'re doing great! Your safety score today is 91/100, which is above average. You\'ve completed 4 trips with minimal alerts. However, I noticed your fatigue level increased during your afternoon drive. I recommend taking more frequent breaks on longer trips.' },
  ]);

  const suggestions = [
    'Show my safety trends',
    'Why did I get an alert?',
    'Tips for long drives',
    'How to improve my score',
  ];

  return (
    <div className="min-h-screen p-6 pb-32 flex flex-col">
      <div className="mb-6">
        <h1 className="mb-2">AI Safety Coach</h1>
        <p className="text-muted-foreground text-sm">Your personal driving assistant</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center glow-primary animate-pulse">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3>RideSafe AI Coach</h3>
            <p className="text-xs text-muted-foreground">Powered by advanced AI</p>
          </div>
        </div>
      </GlassCard>

      <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-primary/20' : 'bg-accent/20'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-primary" />
                ) : (
                  <Brain className="w-4 h-4 text-accent" />
                )}
              </div>

              <div className={`glass-card p-3 rounded-xl ${
                msg.role === 'user' ? 'bg-primary/10 border-primary/30' : 'bg-muted/50'
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="glass-card p-2 rounded-lg text-xs text-left hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-6">
        <GlassCard className="bg-background/95">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Send className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
