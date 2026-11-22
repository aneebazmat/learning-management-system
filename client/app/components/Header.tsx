"use client";
import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import NavItems from "./NavItems";
import ThemeSwitcher from "./ThemeSwitcher";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { getSafeAvatar } from "../utils/avatar";
import AuthModal from "./Auth/AuthModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import GoogleAuth from "./Auth/GoogleAuth";
import GithubAuth from "./Auth/GithubAuth";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Image from "next/image";
import { useLoadUserQuery } from "../../redux/features/auth/authApi";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
}

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: userData, refetch } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = mounted ? (user || userData?.user) : null;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-80 dark:bg-slate-900/90 bg-white fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition-all duration-200 backdrop-blur-md"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <Link
                href={"/"}
                prefetch={true}
                className="text-[25px] font-Poppins font-[600] text-black dark:text-white flex items-center gap-2"
              >
                <span className="text-[#37a39a] text-3xl font-bold">E</span>
                <span>Learning</span>
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* Mobile menu toggle */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>

              {currentUser ? (
                <Link href={"/profile"} prefetch={true}>
                  <div className="relative w-[34px] h-[34px] ml-3 cursor-pointer rounded-full overflow-hidden border-2 border-[#37a39a] shadow-sm hover:ring-2 hover:ring-[#37a39a]/50 transition-all">
                    <Image
                      src={getSafeAvatar(currentUser.avatar?.url)}
                      alt={currentUser.name || "Profile"}
                      fill
                      sizes="34px"
                      className="object-cover"
                    />
                  </div>
                </Link>
              ) : (
                <div
                  className="hidden 800px:flex items-center justify-center w-[36px] h-[36px] rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:border-[#37a39a] hover:text-[#37a39a] transition-all cursor-pointer ml-3 shadow-sm"
                  onClick={() => {
                    setOpen(true);
                    setRoute("Login");
                  }}
                  title="Login / Register"
                >
                  <FiUser size={18} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 top-0 right-0 p-5 shadow-2xl">
              <NavItems activeItem={activeItem} isMobile={true} setOpenSidebar={setOpenSidebar} />
              <div className="mt-8 flex justify-center">
                {currentUser ? (
                  <Link href={"/profile"} prefetch={true} onClick={() => setOpenSidebar(false)}>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      <div className="relative w-[34px] h-[34px] rounded-full overflow-hidden border-2 border-[#37a39a]">
                        <Image
                          src={getSafeAvatar(currentUser.avatar?.url)}
                          alt="avatar"
                          fill
                          sizes="34px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-Poppins font-medium text-black dark:text-white">
                        {currentUser.name}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <button
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#37a39a] text-white font-Poppins font-medium hover:bg-[#2e8880] transition-colors shadow-sm"
                    onClick={() => {
                      setOpenSidebar(false);
                      setOpen(true);
                      setRoute("Login");
                    }}
                  >
                    <FiUser size={18} />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modals */}
      {route === "Login" && (
        <AuthModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login}
          refetch={refetch}
        />
      )}

      {route === "Sign-Up" && (
        <AuthModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp}
          refetch={refetch}
        />
      )}

      {route === "Verification" && (
        <AuthModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
          refetch={refetch}
        />
      )}

      {route === "Google-Auth" && (
        <AuthModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={GoogleAuth}
          refetch={refetch}
        />
      )}

      {route === "Github-Auth" && (
        <AuthModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={GithubAuth}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default Header;
