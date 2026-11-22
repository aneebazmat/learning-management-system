"use client";
import React, { FC, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useSocialAuthMutation } from "../../../redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { signInWithFirebaseGoogle, firebaseConfig } from "../../utils/firebase";
import { AiOutlineCheckCircle } from "react-icons/ai";

interface Props {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: any;
}

const GoogleAuth: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [socialAuth, { isLoading: isAuthLoading }] = useSocialAuthMutation();
  const [isLaunching, setIsLaunching] = useState(false);

  const handleFirebaseGoogleSignIn = async () => {
    setIsLaunching(true);
    try {
      const googleUser = await signInWithFirebaseGoogle();
      await socialAuth({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
      }).unwrap();

      toast.success(`Welcome, ${googleUser.name}!`);
      setOpen(false);
      if (refetch) refetch();
    } catch (err: any) {
      console.error("Firebase Google Auth error:", err);
      toast.error(err?.message || "Failed to authenticate with Firebase Google OAuth");
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center mb-3 border border-gray-100 dark:border-gray-700">
          <FcGoogle size={36} />
        </div>
        <h2 className="text-xl font-Poppins font-semibold text-gray-900 dark:text-white">
          Sign in with Google (Firebase)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-Poppins">
          Connected to Firebase Project: <span className="font-semibold text-[#37a39a]">{firebaseConfig.projectId || "Configured via .env"}</span>
        </p>
      </div>

      {/* Body */}
      <div className="py-6 space-y-5">
        <div className="p-4 rounded-xl bg-teal-50 dark:bg-slate-800/80 border border-teal-100 dark:border-teal-900/40 text-xs font-Poppins space-y-2">
          <div className="flex items-center gap-2 text-[#37a39a] font-semibold">
            <AiOutlineCheckCircle size={16} />
            <span>Firebase Configuration Active</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Auth Domain: <code className="text-[11px] font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded">{firebaseConfig.authDomain || "Configured via .env"}</code>
          </p>
        </div>

        <button
          type="button"
          disabled={isLaunching || isAuthLoading}
          onClick={handleFirebaseGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 hover:border-[#37a39a] text-black dark:text-white font-Poppins font-medium text-sm rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-60"
        >
          <FcGoogle size={22} />
          <span>
            {isLaunching || isAuthLoading ? "Connecting to Firebase..." : "Continue with Google"}
          </span>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setRoute("Login")}
            className="text-xs font-Poppins text-gray-500 hover:text-[#37a39a] transition-colors"
          >
            ← Back to standard login
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;
