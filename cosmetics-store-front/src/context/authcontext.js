import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check admin auth first
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
          try {
            const decoded = jwtDecode(adminToken);
            if (decoded.exp * 1000 > Date.now()) {
              setAdmin({
                token: adminToken,
                userId: decoded.userId,
                name: decoded.name,
                email: decoded.email,
                isAdmin: true,
                role: 'admin'
              });
            }
          } catch (error) {
            localStorage.removeItem('adminToken');
          }
        }

        // Check agent auth if no admin
        const agentToken = localStorage.getItem('agentToken');
        if (agentToken && !admin) {
          try {
            const decoded = jwtDecode(agentToken);
            if (decoded.exp * 1000 > Date.now()) {
              setAgent({
                token: agentToken,
                name: decoded.name,
                email: decoded.email,
                role: 'agent'
              });
            }
          } catch (error) {
            localStorage.removeItem('agentToken');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, role = 'user') => {
    if (role === 'admin') {
      setAdmin(userData);
      setAgent(null);
      localStorage.setItem('adminToken', userData.token);
    } else if (role === 'agent') {
      setAgent(userData);
      setAdmin(null);
      localStorage.setItem('agentToken', userData.token);
    } else {
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('agentToken');
    setAdmin(null);
    setAgent(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      agent, 
      admin, 
      login, 
      logout, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
