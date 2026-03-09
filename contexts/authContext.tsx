"use client";

import { createContext, useContext } from "react";

export type AuthUser = {
  role?: string;
  email?: string;
  full_name?: string;
};

export const AuthContext = createContext<AuthUser | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};