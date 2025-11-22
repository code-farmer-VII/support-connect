import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  onEdit: (messageId: string, newContent: string) => void;
  onPin: (messageId: string) => void;
  canEdit: boolean;
  canPin: boolean;
}

export const MessageBubble = ({ message, onEdit, onPin, canEdit, canPin }: MessageBubbleProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setShowMenu(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handlePin = () => {
    onPin(message.id);
    setShowMenu(false);
  };

  const getBubbleStyle = () => {
    if (message.senderRole === 'system') {
      return 'bg-chat-bubble-system text-foreground mx-auto text-center';
    }
    if (message.senderRole === 'student') {
      return 'bg-chat-bubble-student border border-border text-foreground ml-auto';
    }
    return 'bg-chat-bubble-admin text-foreground';
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div
      className={`max-w-[75%] ${
        message.senderRole === 'student' ? 'ml-auto' : message.senderRole === 'system' ? 'mx-auto' : ''
      }`}
    >
      <div className="relative group">
        <div className={`rounded-lg px-4 py-3 ${getBubbleStyle()}`}>
          {message.senderRole !== 'system' && (
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold">
                {message.senderName}
              </p>
              {message.isPinned && (
                <svg className="w-3 h-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                </svg>
              )}
            </div>
          )}

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full px-2 py-1 text-sm bg-background border border-border rounded resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-xs bg-primary hover:bg-primary-hover text-primary-foreground rounded transition-smooth"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-foreground rounded transition-smooth"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</p>
                {message.isEdited && (
                  <span className="text-xs text-muted-foreground italic">(edited)</span>
                )}
              </div>
            </>
          )}
        </div>

        {!isEditing && message.senderRole !== 'system' && (canEdit || canPin) && (
          <div className="absolute top-0 right-0 -mr-10 opacity-0 group-hover:opacity-100 transition-smooth">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-card border border-border rounded-lg hover:bg-muted transition-smooth"
            >
              <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg py-1 z-50"
              >
                <button
                  onClick={handleCopy}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                {canPin && (
                  <button
                    onClick={handlePin}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {message.isPinned ? 'Unpin' : 'Pin'}
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
