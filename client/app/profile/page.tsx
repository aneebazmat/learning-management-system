"use client";
import React, { FC, useState } from "react";
import Protected from "../hooks/useProtected";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Props {}

const ProfilePage: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Protected>
        <div>
          <Header
            open={open}
            setOpen={setOpen}
            activeItem={activeItem}
            setRoute={setRoute}
            route={route}
          />
          <Profile user={user} />
        </div>
        <Footer />
      </Protected>
    </div>
  );
};

export default ProfilePage;
