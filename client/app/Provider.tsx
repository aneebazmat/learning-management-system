"use client";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "../redux/store";
import { NavigationProvider } from "./components/Common/NavigationLoader";
import { syncAuthState } from "../redux/features/auth/authSlice";

interface ProvidersProps {
  children: any;
}

function AuthInitializer() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(syncAuthState());
  }, [dispatch]);
  return null;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </ThemeProvider>
    </Provider>
  );
}
