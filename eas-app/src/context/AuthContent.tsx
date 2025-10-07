import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/user";

interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void; // ✅ added logout to context type
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  logout: () => {}, // ✅ default placeholder
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Define logout logic
  const logout = () => {
    localStorage.removeItem("token"); // optional if you store auth token
    setUser(null);
    window.location.href = "/login"; // redirect user to login page
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
