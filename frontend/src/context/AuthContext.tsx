import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { User, AuthState } from '../../types';

// Acciones que modifican el estado de autenticación.
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: User };

// Estado inicial: nadie autenticado.
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// URL base del backend en Render.
const API_BASE = 'https://d-morita.onrender.com';

// Reducer que maneja todos los cambios del estado auth.
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case 'RESTORE_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };

    default:
      return state;
  }
};

// Lo que expondrá el contexto al resto de la app.
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

// Creamos el contexto.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Cuando la app carga, intentamos restaurar la sesión usando el token guardado.
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');

      // Si no hay token, no hacemos nada.
      if (!token) return;

      try {
        // Validamos el token preguntando al backend quién es el usuario actual.
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Si el token ya no sirve, limpiamos localStorage.
        if (!res.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }

        const user = await res.json();

        // Guardamos el usuario actualizado.
        localStorage.setItem('user', JSON.stringify(user));

        // Restauramos la sesión en memoria.
        dispatch({
          type: 'RESTORE_SESSION',
          payload: user,
        });
      } catch (error) {
        // Si falla la verificación, limpiamos la sesión local.
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    restoreSession();
  }, []);

  // Función real de login.
  const login = async (username: string, password: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      // Enviamos username y password al backend.
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // Si backend respondió error, actualizamos estado con mensaje.
      if (!res.ok) {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: data.error || 'Error al iniciar sesión',
        });
        return;
      }

      // Guardamos token y user en localStorage para persistir la sesión.
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Actualizamos estado global de auth.
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Error de red al iniciar sesión',
      });
    }
  };

  // Cierra sesión borrando datos locales.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // Devuelve el token actual.
  const getToken = () => localStorage.getItem('token');

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto fácilmente.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};