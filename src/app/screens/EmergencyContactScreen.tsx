import { useState } from 'react';
import { Phone, Plus, Edit, Trash2, User } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

export default function EmergencyContactScreen() {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Sarah Johnson', relationship: 'Spouse', phone: '+1 (555) 123-4567', primary: true },
    { id: 2, name: 'Mike Chen', relationship: 'Brother', phone: '+1 (555) 987-6543', primary: false },
    { id: 3, name: 'Dr. Emily Davis', relationship: 'Doctor', phone: '+1 (555) 246-8135', primary: false },
  ]);

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Emergency Contacts</h1>
        <p className="text-muted-foreground text-sm">Manage your emergency contact list</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-sm mb-1">Auto-Notification</p>
            <p className="text-xs text-muted-foreground">
              These contacts will be automatically notified when SOS is activated or a critical safety alert is detected.
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3>Contacts ({contacts.length})</h3>
          <Button size="sm" variant="ghost">
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add
            </span>
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {contacts.map((contact) => (
          <GlassCard key={contact.id} className={contact.primary ? 'border-primary/30' : ''}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4>{contact.name}</h4>
                  {contact.primary && (
                    <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase">
                      Primary
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{contact.relationship}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-muted/50">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Button fullWidth>
        <span className="flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Contact
        </span>
      </Button>
    </div>
  );
}
