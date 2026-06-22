import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import { api } from "../api/client";

type AdminUser = {
  id: number;
  firstName: string;
  lastName?: string | null;
  email: string;
  roleName: string;
  permissions: string[];
  sessionToken: string;
};

type AuthContextValue = {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const authToken = localStorage.getItem("admin_token");
    if (!authToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<{ user: AdminUser }>("/auth/me", authToken);
      setUser(response.user);
      setToken(authToken);
    } catch {
      localStorage.removeItem("admin_token");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login: async (email, password) => {
        const response = await api.post<{ token: string }>("/auth/login", { email, password });
        localStorage.setItem("admin_token", response.token);
        setToken(response.token);
        await refreshUser();
      },
      logout: async () => {
        try {
          if (token) {
            await api.post("/auth/logout", undefined, token);
          }
        } finally {
          localStorage.removeItem("admin_token");
          setToken(null);
          setUser(null);
        }
      },
      refreshUser
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
