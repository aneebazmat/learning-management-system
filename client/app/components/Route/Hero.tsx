"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";

interface Props {}

const Hero: FC<Props> = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search === "") {
      return;
    }
    router.push(`/courses?title=${search}`);
  };

  return (
    <div className="w-full 1000px:flex items-center min-h-[85vh] py-10">
      {/* Left visual column */}
      <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[400px] w-[400px] hero_animation rounded-[50%] 1100px:left-[5rem] 1500px:left-[12rem] -z-1 opacity-20 dark:opacity-30 pointer-events-none" />
      <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
        <div className="relative w-[85%] max-w-[500px] h-[350px] 1000px:h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80"
            alt="Students collaborating"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
            <span className="text-white font-Poppins font-medium text-lg drop-shadow">
              Industry-Grade Learning Experience
            </span>
          </div>
        </div>
      </div>

      {/* Right text & search column */}
      <div className="1000px:w-[60%] flex flex-col items-center 1000px:items-start 1000px:text-left text-center mt-[40px] 1000px:mt-[0] px-6 1000px:px-12 z-10">
        <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[60px] font-[700] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[75%] 1100px:w-[78%]">
          Improve Your Online Learning Experience Better Instantly
        </h2>
        <br />
        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[500] text-[18px] 1500px:!w-[55%] 1100px:!w-[70%]">
          We have 40k+ Online courses & 500K+ Online registered students. Find your desired courses from them.
        </p>
        <br />
        <br />
        {/* Search bar */}
        <div className="1500px:w-[55%] 1100px:w-[70%] w-[90%] h-[50px] bg-transparent relative">
          <input
            type="search"
            placeholder="Search Courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-gray-100 dark:bg-[#57575738] dark:border-none border border-gray-300 dark:text-[#ffffffdd] text-[#000000eb] rounded-[5px] p-2 pl-4 w-full h-full outline-none text-[16px] font-Josefin shadow-inner"
          />
          <div
            className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] hover:bg-[#20ace0] transition-colors rounded-r-[5px]"
            onClick={handleSearch}
          >
            <BiSearch className="text-white" size={26} />
          </div>
        </div>
        <br />
        <br />
        {/* Social proof avatars */}
        <div className="1500px:w-[55%] 1100px:w-[70%] w-[90%] flex items-center justify-center 1000px:justify-start">
          <div className="flex -space-x-3 overflow-hidden">
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="student"
            />
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="student"
            />
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
              alt="student"
            />
          </div>
          <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-4 pl-3 text-[14px] font-[600]">
            500K+ People already trusted us.{" "}
            <Link
              href="/courses"
              className="dark:text-[#46e256] text-[crimson] hover:underline"
            >
              View Courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
