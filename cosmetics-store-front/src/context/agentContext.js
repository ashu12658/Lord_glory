import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AgentAuthContext = createContext(null);

export const AgentAuthProvider = ({ children }) => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const agentToken = localStorage.getItem("agentToken");
    if (agentToken) {
      const decoded = jwtDecode(agentToken);
      if (decoded?.exp * 1000 > Date.now()) {
        setAgent({
          token: agentToken,
          agentId: decoded.agentId,
          name: decoded.name,
          email: decoded.email,
          role: "agent",
        });
      } else {
        localStorage.removeItem("agentToken");
      }
    }
    setLoading(false);
  }, []);

  const login = (agentData) => {
    setAgent(agentData);
    localStorage.setItem("agentToken", agentData.token);
  };

  const logout = () => {
    localStorage.removeItem("agentToken");
    setAgent(null);
  };

  return (
    <AgentAuthContext.Provider value={{ agent, login, logout, loading }}>
      {children}
    </AgentAuthContext.Provider>
  );
};

export const useAgentAuth = () => {
  const context = useContext(AgentAuthContext);
  if (!context) {
    throw new Error("useAgentAuth must be used within an AgentAuthProvider");
  }
  return context;
};
