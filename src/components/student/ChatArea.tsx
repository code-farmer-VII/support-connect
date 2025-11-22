import { useState, useRef, useEffect } from 'react';
import { Ticket } from '@/types';
import { MessageBubble } from './MessageBubble';

interface ChatAreaProps {
  ticket: Ticket | null;
  onSendMessage: (content: string, replyTo?: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onPinMessage: (messageId: string) => void;
  currentUserId: string;
  isLoading: boolean;
}

export const ChatArea = ({
  ticket,
  onSendMessage,
  onEditMessage,
  onPinMessage,
  currentUserId,
  isLoading
}: ChatAreaProps) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-status-pending text-status-pending-foreground';
      case 'in-progress':
        return 'bg-status-in-progress text-status-in-progress-foreground';
      case 'resolved':
        return 'bg-status-resolved text-status-resolved-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-6">
          <svg
            className="w-24 h-24 mx-auto mb-6 text-muted-foreground/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-foreground mb-2">No conversation selected</h3>
          <p className="text-muted-foreground">
            Select a department from the sidebar to view your tickets or create a new one
          </p>
        </div>
      </div>
    );
  }

  const pinnedMessages = ticket.messages.filter(m => m.isPinned);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{ticket.subject}</h2>
            <p className="text-sm text-muted-foreground">
              Queue position: {ticket.queuePosition ?? 0}
            </p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
            {ticket.status.replace('-', ' ').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Pinned Messages */}
      {pinnedMessages.length > 0 && (
        <div className="border-b border-border bg-muted/30 px-6 py-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-muted-foreground mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
            </svg>
            <div className="flex-1 text-sm">
              <p className="font-medium text-foreground mb-1">Pinned Messages</p>
              {pinnedMessages.map(msg => (
                <p key={msg.id} className="text-muted-foreground mb-1">
                  {msg.content.substring(0, 100)}
                  {msg.content.length > 100 && '...'}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {ticket.messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            onEdit={onEditMessage}
            onPin={onPinMessage}
            canEdit={message.senderId === currentUserId && message.senderRole !== 'system'}
            canPin={true}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {ticket.status !== 'resolved' && (
        <div className="border-t border-border bg-card px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
