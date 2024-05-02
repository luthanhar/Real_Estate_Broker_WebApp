import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") != null
  );
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) ?? null
  );
  const [user, setUser] = useState(
    localStorage.getItem("token")
      ? jwtDecode(JSON.parse(localStorage.getItem("token")).access)
      : null
  );

  const updateToken = async (token) => {
    try {
      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: token.refresh,
        }),
      });
      if (!response.ok) {
        logout();
        throw new Error("New Token not fetched");
      }
      const data = await response.json();
      login(data);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    const jwtToken = JSON.parse(localStorage.getItem("token"));
    if (jwtToken) {
      updateToken(jwtToken);
    }
  }, []);

  useEffect(() => {
    let time = 0.5 * 60 * 1000;
    const updateInterval = setInterval(() => {
      if (token) {
        updateToken(token);
      }
    }, time);
    return () => clearInterval(updateInterval); // Cleanup the interval on unmount
  }, [token]);

  const login = (jwtToken) => {
    setIsLoggedIn(true);
    setToken(jwtToken);
    setUser(jwtDecode(jwtToken.access));
    localStorage.setItem("token", JSON.stringify(jwtToken));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
