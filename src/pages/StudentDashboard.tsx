import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/api/mockApi';
import { Ticket, Department, DEPARTMENTS } from '@/types';
import { DepartmentSidebar } from '@/components/student/DepartmentSidebar';
import { ChatArea } from '@/components/student/ChatArea';
import { NewTicketModal } from '@/components/student/NewTicketModal';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [user]);

  useEffect(() => {
    if (selectedDepartment) {
      const departmentTickets = tickets.filter(t => t.department === selectedDepartment);
      if (departmentTickets.length > 0) {
        setSelectedTicket(departmentTickets[0]);
      } else {
        setSelectedTicket(null);
      }
    }
  }, [selectedDepartment, tickets]);

  const loadTickets = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await mockApi.getStudentTickets(user.id);
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (department: Department, subject: string, message: string) => {
    if (!user) return;
    
    try {
      const newTicket = await mockApi.createTicket(user.id, user.name, department, subject, message);
      setTickets(prev => [...prev, newTicket]);
      setSelectedDepartment(department);
      setSelectedTicket(newTicket);
      setIsNewTicketModalOpen(false);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const handleSendMessage = async (content: string, replyTo?: string) => {
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
      <DepartmentSidebar
        departments={Object.keys(DEPARTMENTS) as Department[]}
        tickets={tickets}
        selectedDepartment={selectedDepartment}
        onSelectDepartment={setSelectedDepartment}
        onNewTicket={() => setIsNewTicketModalOpen(true)}
        user={user!}
        onLogout={logout}
      />

      <ChatArea
        ticket={selectedTicket}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onPinMessage={handlePinMessage}
        currentUserId={user?.id || ''}
        isLoading={isLoading}
      />

      {isNewTicketModalOpen && (
        <NewTicketModal
          onClose={() => setIsNewTicketModalOpen(false)}
          onSubmit={handleCreateTicket}
        />
      )}
    </div>
  );
}
