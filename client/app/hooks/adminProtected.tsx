"use client";
import React from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLoadUserQuery } from "../../redux/features/auth/authApi";

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useLoadUserQuery(undefined, {});

  const currentUser = user || data?.user;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37a39a]"></div>
      </div>
    );
  }

  if (!currentUser) {
    return redirect("/");
  }

  const isAdmin = currentUser?.role === "admin";

  return isAdmin ? <>{children}</> : redirect("/");
}
