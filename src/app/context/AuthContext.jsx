"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      setLoading(true);
      const session = await authClient.getSession();
      
      if (session?.data?.user) {
        // Fetch custom role from our backend
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          withCredentials: true,
        });
        setUser({ ...session.data.user, role: res.data.user.role });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function logout() {
    await authClient.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, refreshUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}