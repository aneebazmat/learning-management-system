"use client";
import React, { FC } from "react";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";

const reviewsData = [
  {
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    profession: "Junior Frontend Engineer",
    comment: "This LMS platform is the most comprehensive tutorial project I have ever experienced. The Redux Toolkit Query integration and Tailwind structure are pure industry standard.",
    rating: 5,
  },
  {
    name: "Samantha Wright",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    profession: "Full Stack Developer",
    comment: "The Next.js 13 App Router concepts combined with Express and MongoDB backend made everything click. Highly recommended for any serious engineer.",
    rating: 5,
  },
  {
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    profession: "Software Engineering Student",
    comment: "The admin course creator wizard and video player curriculum are exceptionally well built. I landed my first internship using this portfolio piece!",
    rating: 5,
  },
];

const Reviews: FC = () => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto py-12">
      <div className="w-full 800px:flex items-center justify-between">
        <div className="800px:w-[50%]">
          <div className="relative w-full h-[300px] 800px:h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
              alt="Students enjoying learning"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="800px:w-[50%] 800px:pl-10 mt-6 800px:mt-0">
          <h3 className="text-[25px] 800px:text-[40px] font-Poppins font-[700] text-black dark:text-white leading-tight">
            Our Students Are{" "}
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#2190ff] to-[#37a39a]">
              Our Strength
            </span>
            <br />
            See What They Say About Us
          </h3>
          <p className="mt-3 text-gray-600 dark:text-gray-300 font-Poppins text-[15px]">
            Join over 500,000 learners accelerating their tech careers worldwide with verified hands-on projects and mentorship.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {reviewsData.map((review, index) => (
          <div
            key={index}
            className="p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-800/40 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#37a39a]">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-Poppins font-semibold text-black dark:text-white text-[16px]">
                  {review.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-Poppins">
                  {review.profession}
                </p>
              </div>
            </div>
            <div className="flex items-center my-3 text-[#f6b100]">
              {[...Array(review.rating)].map((_, i) => (
                <AiFillStar key={i} size={18} />
              ))}
            </div>
            <p className="text-sm font-Poppins text-gray-600 dark:text-gray-300 italic">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
