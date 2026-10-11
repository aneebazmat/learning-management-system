"use client";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "../redux/store";

interface ProvidersProps {
  children: any;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
