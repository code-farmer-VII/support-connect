export type UserRole = 'student' | 'technical' | 'enrollment' | 'student-success' | 'complaints';

export type TicketStatus = 'pending' | 'in-progress' | 'resolved';

export type Department = 'technical' | 'enrollment' | 'student-success' | 'complaints';

export const DEPARTMENTS: Record<Department, { name: string; description: string }> = {
  'technical': {
    name: 'Technical Issues',
    description: 'Technical problems and bug reports'
  },
  'enrollment': {
    name: 'Enrollment Issues',
    description: 'Course registration and academic records'
  },
  'student-success': {
    name: 'Student Success',
    description: 'Academic guidance and career planning'
  },
  'complaints': {
    name: 'Complaints',
    description: 'Formal complaints and grievances'
  }
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole | 'system';
  content: string;
  timestamp: Date;
  isEdited?: boolean;
  isPinned?: boolean;
  replyTo?: string;
}

export interface Ticket {
  id: string;
  studentId: string;
  studentName: string;
  department: Department;
  status: TicketStatus;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
  queuePosition?: number;
  messages: Message[];
}
