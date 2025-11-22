import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/api/mockApi';
import { Ticket, TicketStatus, Department } from '@/types';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminChatArea } from '@/components/admin/AdminChatArea';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [user]);

  const loadTickets = async () => {
    if (!user || user.role === 'student') return;
    setIsLoading(true);
    try {
      const data = await mockApi.getDepartmentTickets(user.role as Department);
      setTickets(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
      }
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t =>
    statusFilter === 'all' ? true : t.status === statusFilter
  );

  const handleSendMessage = async (content: string) => {
    if (!selectedTicket || !user) return;

    try {
      const newMessage = await mockApi.addMessage(
        selectedTicket.id,
        user.id,
        user.name,
        user.role,
        content
      );

      setTickets(prev =>
        prev.map(t =>
          t.id === selectedTicket.id
            ? { ...t, messages: [...t.messages, newMessage] }
            : t
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleUpdateStatus = async (newStatus: TicketStatus) => {
    if (!selectedTicket) return;

    try {
      const updatedTicket = await mockApi.updateTicketStatus(selectedTicket.id, newStatus);
      setTickets(prev =>
        prev.map(t => (t.id === updatedTicket.id ? updatedTicket : t))
      );
      setSelectedTicket(updatedTicket);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!selectedTicket) return;

    try {
      await mockApi.editMessage(selectedTicket.id, messageId, newContent);
      setTickets(prev =>
        prev.map(t =>
          t.id === selectedTicket.id
            ? {
                ...t,
                messages: t.messages.map(m =>
                  m.id === messageId ? { ...m, content: newContent, isEdited: true } : m
                )
              }
            : t
        )
      );
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handlePinMessage = async (messageId: string) => {
    if (!selectedTicket) return;

    try {
      await mockApi.togglePinMessage(selectedTicket.id, messageId);
      setTickets(prev =>
        prev.map(t =>
          t.id === selectedTicket.id
            ? {
                ...t,
                messages: t.messages.map(m =>
                  m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
                )
              }
            : t
        )
      );
    } catch (error) {
      console.error('Failed to pin message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar
        tickets={filteredTickets}
        selectedTicket={selectedTicket}
        onSelectTicket={setSelectedTicket}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        user={user!}
        onLogout={logout}
        isLoading={isLoading}
      />

      <AdminChatArea
        ticket={selectedTicket}
        onSendMessage={handleSendMessage}
        onUpdateStatus={handleUpdateStatus}
        onEditMessage={handleEditMessage}
        onPinMessage={handlePinMessage}
        currentUserId={user?.id || ''}
      />
    </div>
  );
}
