"use client";
import React, { FC, useState } from "react";
import Protected from "../../hooks/useProtected";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CourseContent from "../../components/Course/CourseContent";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface Props {
  params: {
    id: string;
  };
}

const CourseAccessPage: FC<Props> = ({ params }) => {
  const { id } = params;
  const { user } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(1);
  const [route, setRoute] = useState("Login");

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
          <CourseContent id={id} user={user} />
        </div>
        <Footer />
      </Protected>
    </div>
  );
};

export default CourseAccessPage;
