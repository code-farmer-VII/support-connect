import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Mock API call
const mockLogin = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock users
  const mockUsers: Record<string, User> = {
    'student@example.com': {
      id: 's1',
      name: 'John Student',
      email: 'student@example.com',
      role: 'student'
    },
    'tech@example.com': {
      id: 'a1',
      name: 'Tech Admin',
      email: 'tech@example.com',
      role: 'technical'
    },
    'enroll@example.com': {
      id: 'a2',
      name: 'Enrollment Admin',
      email: 'enroll@example.com',
      role: 'enrollment'
    },
    'success@example.com': {
      id: 'a3',
      name: 'Success Admin',
      email: 'success@example.com',
      role: 'student-success'
    },
    'complaints@example.com': {
      id: 'a4',
      name: 'Complaints Admin',
      email: 'complaints@example.com',
      role: 'complaints'
    }
  };

  const user = mockUsers[email];
  if (!user || password !== 'password') {
    throw new Error('Invalid credentials');
  }

  return user;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const user = await mockLogin(email, password);
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
