"use client";
import React, { FC, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
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
            About{" "}
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#2190ff] to-[#37a39a]">
              ELearning Platform
            </span>
          </h1>
          <br />
          <div className="max-w-3xl mx-auto space-y-6 text-base font-Poppins text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              ELearning is an industrial-level Learning Management System created to bridge the gap between academic programming theory and real-world software engineering mastery.
            </p>
            <p>
              Our curriculum is engineered around building production-grade full-stack architectures using TypeScript, Next.js, Redux Toolkit Query, Node.js, Express, Redis, and MongoDB Atlas.
            </p>
            <p>
              Whether you are an aspiring software engineer preparing for competitive technical interviews or a senior architect standardizing enterprise design systems, our platform delivers the exact hands-on experience you need.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
