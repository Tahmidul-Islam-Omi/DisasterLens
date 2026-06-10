import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import type { Role } from '../types';

interface RoleContextType {
  role: Role;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // Get role from authenticated user, default to 'Volunteer' if not authenticated
  const role: Role = user?.role || 'Volunteer';

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
