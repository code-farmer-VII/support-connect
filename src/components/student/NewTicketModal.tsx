import { useState } from 'react';
import { Department, DEPARTMENTS } from '@/types';

interface NewTicketModalProps {
  onClose: () => void;
  onSubmit: (department: Department, subject: string, message: string) => void;
}

export const NewTicketModal = ({ onClose, onSubmit }: NewTicketModalProps) => {
  const [department, setDepartment] = useState<Department | ''>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (department && subject.trim() && message.trim()) {
      onSubmit(department as Department, subject.trim(), message.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Create New Ticket</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Department Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Department *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(DEPARTMENTS) as Department[]).map(dept => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setDepartment(dept)}
                  className={`text-left px-4 py-3 rounded-lg border-2 transition-smooth ${
                    department === dept
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <h3 className="font-medium text-foreground">{DEPARTMENTS[dept].name}</h3>
                  <p className="text-sm text-muted-foreground">{DEPARTMENTS[dept].description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Provide details about your issue..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!department || !subject.trim() || !message.trim()}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
