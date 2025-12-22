import { createContext, useEffect, useState } from "react";
import { API } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   
  const [loading, setLoading] = useState(true); 

 
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me"); 
        setUser(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token"); 
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

 
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
