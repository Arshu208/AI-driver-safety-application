import { Check, Zap, Crown } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

export default function SubscriptionPlans() {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'forever',
      icon: Zap,
      color: 'muted',
      features: [
        'Basic drowsiness detection',
        'Safety alerts',
        'Trip tracking',
        '7-day trip history',
        'Email support',
      ],
      current: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      icon: Crown,
      color: 'primary',
      popular: true,
      features: [
        'Advanced AI monitoring',
        'Real-time eye tracking',
        'Voice assistant',
        'Unlimited trip history',
        'Analytics & reports',
        'Emergency SOS',
        'Priority support',
        'Fleet management (up to 5)',
      ],
      current: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      icon: Crown,
      color: 'accent',
      features: [
        'Everything in Pro',
        'Unlimited fleet size',
        'Custom integrations',
        'Dedicated support',
        'API access',
        'White-label options',
        'SLA guarantees',
      ],
      current: false,
    },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground text-sm">Choose the plan that's right for you</p>
      </div>

      <GlassCard glow="success" className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1">Pro Member</h3>
            <p className="text-sm text-muted-foreground">Active until June 11, 2026</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-success/20 text-success text-xs uppercase">
            Active
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <GlassCard
              key={index}
              glow={plan.popular ? 'primary' : 'none'}
              className={plan.popular ? 'border-2 border-primary' : plan.current ? 'border-success/30' : ''}
            >
              {plan.popular && (
                <div className="mb-4 -mt-2 -mx-2 px-4 py-1 bg-primary/20 border-b border-primary/30">
                  <p className="text-xs text-primary text-center uppercase">Most Popular</p>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full bg-${plan.color}/20 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${plan.color}`} />
                  </div>
                  <div>
                    <h3 className="mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl">{plan.price}</span>
                      <span className="text-xs text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                </div>
                {plan.current && (
                  <div className="px-2 py-1 rounded-full bg-success/20 text-success text-xs uppercase">
                    Current
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <Check className={`w-4 h-4 text-${plan.popular ? 'primary' : 'success'} flex-shrink-0`} />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                fullWidth
                variant={plan.current ? 'ghost' : plan.popular ? 'primary' : 'secondary'}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : plan.price === 'Custom' ? 'Contact Sales' : 'Upgrade'}
              </Button>
            </GlassCard>
          );
        })}
      </div>

      <div className="mt-6">
        <GlassCard className="bg-primary/5 border border-primary/30">
          <p className="text-sm text-center mb-1">Need help choosing?</p>
          <p className="text-xs text-muted-foreground text-center">
            Contact our team for personalized recommendations
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
