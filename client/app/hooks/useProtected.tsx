"use client";
import React from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLoadUserQuery } from "../../redux/features/auth/authApi";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const [mounted, setMounted] = React.useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = user || data?.user;

  // If user is already loaded/cached in Redux, render immediately with 0 delay!
  if (currentUser) {
    return <>{children}</>;
  }

  // Only show the spinner on cold start if we don't have a user yet and network query is running
  if (isLoading || !mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37a39a]"></div>
      </div>
    );
  }

  return redirect("/");
}
