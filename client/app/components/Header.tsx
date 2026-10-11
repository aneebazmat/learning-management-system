"use client";
import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import NavItems from "./NavItems";
import ThemeSwitcher from "./ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import AuthModal from "./Auth/AuthModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
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
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});

  const currentUser = user || userData?.user;

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
            ? "dark:bg-opacity-80 dark:bg-slate-900/90 bg-white fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500 backdrop-blur-md"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <Link
                href={"/"}
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
                <Link href={"/profile"}>
                  <div className="relative w-[32px] h-[32px] ml-3 cursor-pointer rounded-full overflow-hidden border-2 border-[#37a39a]">
                    <Image
                      src={
                        currentUser.avatar?.url ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={currentUser.name || "Profile"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={28}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black ml-4 hover:text-[#37a39a] transition-colors"
                  onClick={() => {
                    setOpen(true);
                    setRoute("Login");
                  }}
                />
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
              <NavItems activeItem={activeItem} isMobile={true} />
              <div className="mt-8 flex justify-center">
                {currentUser ? (
                  <Link href={"/profile"} onClick={() => setOpenSidebar(false)}>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      <div className="relative w-[32px] h-[32px] rounded-full overflow-hidden border-2 border-[#37a39a]">
                        <Image
                          src={
                            currentUser.avatar?.url ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                          }
                          alt="avatar"
                          fill
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
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#37a39a] text-white font-Poppins font-medium"
                    onClick={() => {
                      setOpenSidebar(false);
                      setOpen(true);
                      setRoute("Login");
                    }}
                  >
                    <HiOutlineUserCircle size={22} />
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
        />
      )}

      {route === "Sign-Up" && (
        <AuthModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp}
        />
      )}

      {route === "Verification" && (
        <AuthModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
        />
      )}
    </div>
  );
};

export default Header;
