"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "admin" | "manager" | "customer";

interface User {
  name: string;
  email: string;
  role: Role;
  isVIP?: boolean;
}

interface AuthContextType {
  user: User | null;
  theme: "light" | "dark";
  toggleTheme: () => void;
  login: (email: string, role: Role, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Load theme setting
    const savedTheme = localStorage.getItem("rm_theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }

    // Load auth setting
    const savedUser = localStorage.getItem("rm_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    } else {
      // Default demo customer logged in
      setUser({
        name: "Carlos Mendoza",
        email: "carlos.mendoza@email.com",
        role: "customer",
        isVIP: true,
      });
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("rm_theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const login = (email: string, role: Role, name?: string) => {
    const defaultName = name || (role === "admin" ? "Super Admin" : role === "manager" ? "Encargado de Tienda" : email.split("@")[0]);
    const newUser: User = {
      name: defaultName,
      email,
      role,
      isVIP: role === "customer" ? true : false,
    };
    setUser(newUser);
    localStorage.setItem("rm_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rm_user");
  };

  return (
    <AuthContext.Provider value={{ user, theme, toggleTheme, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
