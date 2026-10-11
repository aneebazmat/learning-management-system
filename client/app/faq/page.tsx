"use client";
import React, { FC, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQ from "../components/Route/FAQ";

const FAQPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(4);
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
        <div className="pt-6">
          <FAQ />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
