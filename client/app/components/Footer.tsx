"use client";
import React from "react";
import Link from "next/link";
import { AiOutlineGithub, AiOutlineTwitter, AiOutlineLinkedin, AiOutlineYoutube } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#040c18] mt-16 transition-colors">
      <div className="w-[90%] 800px:w-[85%] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <Link
              href="/"
              className="text-[25px] font-Poppins font-[600] text-black dark:text-white flex items-center gap-2"
            >
              <span className="text-[#37a39a] text-3xl font-bold">E</span>
              <span>Learning</span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 font-Poppins">
              The premier industrial learning management system empowering developers, engineers, and students worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-Poppins font-semibold text-black dark:text-white mb-3 text-base">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm font-Poppins text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-[#37a39a] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#37a39a] transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#37a39a] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#37a39a] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h4 className="font-Poppins font-semibold text-black dark:text-white mb-3 text-base">
              Policies & Terms
            </h4>
            <ul className="space-y-2 text-sm font-Poppins text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/policy" className="hover:text-[#37a39a] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-[#37a39a] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-[#37a39a] transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-Poppins font-semibold text-black dark:text-white mb-3 text-base">
              Connect With Us
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-Poppins mb-3">
              Follow our community updates, tutorials, and open source projects.
            </p>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:text-[#37a39a] transition-colors"
              >
                <AiOutlineGithub size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:text-[#37a39a] transition-colors"
              >
                <AiOutlineTwitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:text-[#37a39a] transition-colors"
              >
                <AiOutlineLinkedin size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:text-[#37a39a] transition-colors"
              >
                <AiOutlineYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500 font-Poppins">
          Copyright © {new Date().getFullYear()} ELearning Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
