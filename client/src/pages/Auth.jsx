import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    /*if (!storedToken) {
      setToken(null);
    }
    setToken(storedToken);*/
    setToken(storedToken ? storedToken : null);
    setLoading(false); // Mark loading as complete after setting the token
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
