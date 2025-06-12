import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define o tipo para o contexto do usuário
interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

// Cria o contexto com um valor inicial nulo
const UserContext = createContext<UserContextType | null>(null);

// Define o tipo para as propriedades do UserProvider
interface UserProviderProps {
  children: ReactNode;
}

// Define o provedor do contexto do usuário
export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Só acessa localStorage no cliente
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  useEffect(() => {
    // Também protege o set/remove do localStorage
    if (typeof window !== "undefined") {
      if (userId) {
        localStorage.setItem("userId", userId);
      } else {
        localStorage.removeItem("userId");
      }
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para acessar o contexto do usuário
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de UserProvider");
  }
  return context;
};
