"use client";
import React, { FC, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PolicyPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <div className="w-[90%] 800px:w-[85%] m-auto py-12">
          <h1 className="text-3xl sm:text-4xl font-Poppins font-bold text-center text-black dark:text-white">
            Platform Policies & Terms
          </h1>
          <br />
          <div className="max-w-3xl mx-auto space-y-6 text-sm sm:text-base font-Poppins text-gray-700 dark:text-gray-300 leading-relaxed">
            <h3 className="text-xl font-bold text-black dark:text-white">
              1. Terms of Service
            </h3>
            <p>
              By accessing ELearning platform, you agree to adhere to all community guidelines, intellectual property terms, and ethical code of conduct. Course videos and source code materials are licensed for individual study only.
            </p>
            <h3 className="text-xl font-bold text-black dark:text-white">
              2. Privacy & Data Handling
            </h3>
            <p>
              We prioritize data privacy. Your credentials, password hashes, and user records are encrypted in compliance with enterprise security protocols. Session information stored in Redis is strictly used to validate authenticated requests.
            </p>
            <h3 className="text-xl font-bold text-black dark:text-white">
              3. Refund & Access Policy
            </h3>
            <p>
              Enrolled students enjoy lifetime access to curriculum materials. Inquiries regarding enrollment billing may be submitted to our administrative support desk within 14 days of purchase.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PolicyPage;
