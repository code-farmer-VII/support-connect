import { Ticket, Message, TicketStatus, Department } from '@/types';

// Mock data storage
let mockTickets: Ticket[] = [
  {
    id: 't1',
    studentId: 's1',
    studentName: 'John Student',
    department: 'technical',
    status: 'pending',
    subject: 'Cannot access course materials',
    createdAt: new Date('2025-01-15T10:00:00'),
    updatedAt: new Date('2025-01-15T10:00:00'),
    queuePosition: 1,
    messages: [
      {
        id: 'm1',
        ticketId: 't1',
        senderId: 'system',
        senderName: 'System',
        senderRole: 'system',
        content: 'There are 2 users ahead of you. Please wait.',
        timestamp: new Date('2025-01-15T10:00:00')
      },
      {
        id: 'm2',
        ticketId: 't1',
        senderId: 's1',
        senderName: 'John Student',
        senderRole: 'student',
        content: 'I cannot access my course materials on the platform. When I click on the course, it shows an error.',
        timestamp: new Date('2025-01-15T10:01:00')
      }
    ]
  },
  {
    id: 't2',
    studentId: 's1',
    studentName: 'John Student',
    department: 'enrollment',
    status: 'resolved',
    subject: 'Need to withdraw from a course',
    createdAt: new Date('2025-01-14T14:00:00'),
    updatedAt: new Date('2025-01-14T15:30:00'),
    messages: [
      {
        id: 'm3',
        ticketId: 't2',
        senderId: 'system',
        senderName: 'System',
        senderRole: 'system',
        content: 'There are 0 users ahead of you. Please wait.',
        timestamp: new Date('2025-01-14T14:00:00')
      },
      {
        id: 'm4',
        ticketId: 't2',
        senderId: 's1',
        senderName: 'John Student',
        senderRole: 'student',
        content: 'I need to withdraw from Math 101. Can you help me with this?',
        timestamp: new Date('2025-01-14T14:01:00')
      },
      {
        id: 'm5',
        ticketId: 't2',
        senderId: 'a2',
        senderName: 'Enrollment Admin',
        senderRole: 'enrollment',
        content: 'Hello! I can help you with that. I\'ve processed your withdrawal request for Math 101. You should see the update in your student portal within 24 hours.',
        timestamp: new Date('2025-01-14T15:20:00')
      },
      {
        id: 'm6',
        ticketId: 't2',
        senderId: 's1',
        senderName: 'John Student',
        senderRole: 'student',
        content: 'Thank you so much!',
        timestamp: new Date('2025-01-14T15:25:00')
      }
    ]
  }
];

// Mock API functions
export const mockApi = {
  // Get all tickets for a student
  getStudentTickets: async (studentId: string): Promise<Ticket[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTickets.filter(t => t.studentId === studentId);
  },

  // Get tickets for a specific department
  getDepartmentTickets: async (department: Department): Promise<Ticket[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTickets.filter(t => t.department === department);
  },

  // Create a new ticket
  createTicket: async (
    studentId: string,
    studentName: string,
    department: Department,
    subject: string,
    initialMessage: string
  ): Promise<Ticket> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const departmentTickets = mockTickets.filter(
      t => t.department === department && t.status === 'pending'
    );
    const queuePosition = departmentTickets.length;

    const ticketId = `t${Date.now()}`;
    const systemMessageId = `m${Date.now()}`;
    const userMessageId = `m${Date.now() + 1}`;

    const newTicket: Ticket = {
      id: ticketId,
      studentId,
      studentName,
      department,
      status: 'pending',
      subject,
      createdAt: new Date(),
      updatedAt: new Date(),
      queuePosition,
      messages: [
        {
          id: systemMessageId,
          ticketId,
          senderId: 'system',
          senderName: 'System',
          senderRole: 'system',
          content: `There are ${queuePosition} users ahead of you. Please wait.`,
          timestamp: new Date()
        },
        {
          id: userMessageId,
          ticketId,
          senderId: studentId,
          senderName: studentName,
          senderRole: 'student',
          content: initialMessage,
          timestamp: new Date()
        }
      ]
    };

    mockTickets.push(newTicket);
    return newTicket;
  },

  // Add a message to a ticket
  addMessage: async (
    ticketId: string,
    senderId: string,
    senderName: string,
    senderRole: 'student' | 'technical' | 'enrollment' | 'student-success' | 'complaints',
    content: string
  ): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const newMessage: Message = {
      id: `m${Date.now()}`,
      ticketId,
      senderId,
      senderName,
      senderRole,
      content,
      timestamp: new Date()
    };

    ticket.messages.push(newMessage);
    ticket.updatedAt = new Date();

    return newMessage;
  },

  // Update ticket status
  updateTicketStatus: async (ticketId: string, status: TicketStatus): Promise<Ticket> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    ticket.status = status;
    ticket.updatedAt = new Date();

    // Add system message
    const systemMessage: Message = {
      id: `m${Date.now()}`,
      ticketId,
      senderId: 'system',
      senderName: 'System',
      senderRole: 'system',
      content: `Status changed to ${status.replace('-', ' ')}`,
      timestamp: new Date()
    };

    ticket.messages.push(systemMessage);

    return ticket;
  },

  // Edit a message
  editMessage: async (ticketId: string, messageId: string, newContent: string): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const message = ticket.messages.find(m => m.id === messageId);
    if (!message) throw new Error('Message not found');

    message.content = newContent;
    message.isEdited = true;

    return message;
  },

  // Toggle pin message
  togglePinMessage: async (ticketId: string, messageId: string): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const message = ticket.messages.find(m => m.id === messageId);
    if (!message) throw new Error('Message not found');

    message.isPinned = !message.isPinned;

    return message;
  }
};
