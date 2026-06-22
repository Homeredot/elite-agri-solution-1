import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiError, api } from "../api/client";
import type { StoreCustomerProfile } from "../types/store";

const TOKEN_KEY = "store_customer_token";
const PROFILE_KEY = "store_customer_profile";

type LoginPayload = {
  token: string;
  customer: StoreCustomerProfile;
};

type AuthContextValue = {
  token: string | null;
  customer: StoreCustomerProfile | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => void;
  logout: () => void;
  updateCustomer: (customer: StoreCustomerProfile) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const persistAuth = (token: string | null, customer: StoreCustomerProfile | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (customer) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(customer));
  } else {
    localStorage.removeItem(PROFILE_KEY);
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [customer, setCustomer] = useState<StoreCustomerProfile | null>(() =>
    readStorage<StoreCustomerProfile | null>(PROFILE_KEY, null)
  );

  const customerQuery = useQuery({
    queryKey: ["store-customer-me", token],
    queryFn: () => api.get<{ data: StoreCustomerProfile }>("/store/customers/me"),
    enabled: Boolean(token),
    retry: false
  });

  useEffect(() => {
    persistAuth(token, customer);
  }, [token, customer]);

  useEffect(() => {
    if (customerQuery.data?.data) {
      setCustomer(customerQuery.data.data);
    }
  }, [customerQuery.data]);

  useEffect(() => {
    if (!(customerQuery.error instanceof ApiError)) {
      return;
    }

    if (customerQuery.error.status === 401 || customerQuery.error.status === 403) {
      setToken(null);
      setCustomer(null);
    }
  }, [customerQuery.error]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      customer,
      isLoading: Boolean(token) && customerQuery.isPending,
      login: (payload) => {
        persistAuth(payload.token, payload.customer);
        setToken(payload.token);
        setCustomer(payload.customer);
      },
      logout: () => {
        persistAuth(null, null);
        setToken(null);
        setCustomer(null);
      },
      updateCustomer: (nextCustomer) => {
        setCustomer(nextCustomer);
      }
    }),
    [customer, customerQuery.isPending, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
