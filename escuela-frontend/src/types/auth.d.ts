declare module '@/stores/auth' {
  import { Ref, ComputedRef } from 'vue';

  export interface User {
    id_usuario: number;
    nombre: string;
    correo: string;
    rol: string;
  }

  export interface AuthStore {
    user: Ref<User | null>;
    isAuthenticated: Ref<boolean>;
    userRole: ComputedRef<string | null>;
    userName: ComputedRef<string>;
    userId: ComputedRef<number | null>;
    isDireccion: ComputedRef<boolean>;
    isProfesor: ComputedRef<boolean>;
    isPadre: ComputedRef<boolean>;
    setUser: (userData: User) => void;
    clearUser: () => void;
    logout: () => Promise<void>;
    hasRole: (role: string) => boolean;
  }

  export function useAuthStore(): AuthStore;
}
