"use client";
import { SessionProvider as NesxSeesionProvider } from "next-auth/react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <NesxSeesionProvider>{children}</NesxSeesionProvider>;
};
