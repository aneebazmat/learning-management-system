"use client";
import React from "react";
import { IoCloseOutline } from "react-icons/io5";

interface AuthModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: any;
  setRoute?: (route: string) => void;
  refetch?: any;
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  setOpen,
  component: Component,
  setRoute,
  refetch,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 rounded-[12px] shadow-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 transition-all transform scale-100 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <IoCloseOutline size={26} />
        </button>
        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch} />
      </div>
    </div>
  );
};

export default AuthModal;
