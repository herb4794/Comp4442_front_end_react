import type React from "react";
import { createContext, useState, useEffect } from "react";
import { AuthUser, ContextTypes } from "../type/Type";
import toast from "react-hot-toast";

export const ContextObj = createContext<ContextTypes>({
  user: "",
  loginStatus: false,
  setAuth: () => { },
  signOut: async () => { },
  auth: { email: "", role: 1 },
  checkLoginStatus: async () => { },
  loading: true,
});

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState("");
  const [auth, setAuthState] = useState<AuthUser>({ email: "", role: 1 });
  const [loginStatus, setLoginStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  const runSetAuth = (authData: AuthUser) => {
    setAuthState(authData);
    setUser(authData.email);
    setLoginStatus(!!authData.email);
  };

  const clearAuth = () => {
    setAuthState({ email: "", role: 1 });
    setUser("");
    setLoginStatus(false);
  };

  const checkLoginStatus = async () => {
    try {
      const res = await fetch("http://localhost:8080/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        clearAuth();
        return;
      }

      const data = await res.json();

      runSetAuth({
        email: data.email,
        role: data.role,
      });
    } catch (error) {
      clearAuth();
    }
  };

  const runSignOut = async () => {
    try {
      const res = await fetch("http://localhost:8080/signout", {
        method: "POST",
        credentials: "include",
      });

      const status = await res.json()
      toast.success(status.message)

    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      clearAuth();
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkLoginStatus();
      setLoading(false);
    };

    init();
  }, []);

  const contextValue: ContextTypes = {
    user,
    setAuth: runSetAuth,
    signOut: runSignOut,
    loginStatus,
    auth,
    checkLoginStatus,
    loading,
  };

  return (
    <ContextObj.Provider value={contextValue}>
      {children}
    </ContextObj.Provider>
  );
};

export default ContextProvider;
