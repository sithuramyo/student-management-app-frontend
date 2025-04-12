import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  typ: string;
  name: string;
  sub: string;
  email: string;
  profile: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-store',
    }
  )
);
