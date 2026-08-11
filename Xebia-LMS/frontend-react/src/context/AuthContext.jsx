import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const storedSession = localStorage.getItem("lms_session");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
    setLoading(false);
  }, []);

  const login = (user) => {
    setSession({ user });
    localStorage.setItem("lms_session", JSON.stringify({ user }));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("lms_session");
    window.location.href = "/signin";
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return {
    data: context.session,
    status: context.loading ? "loading" : context.session ? "authenticated" : "unauthenticated",
  };
};
