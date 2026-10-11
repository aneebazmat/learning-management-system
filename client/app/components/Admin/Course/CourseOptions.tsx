"use client";
import React, { FC } from "react";
import { styles } from "../../../styles/style";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-hot-toast";

interface Props {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
}

const CourseOptions: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitChange = (index: number, value: any) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handleDeleteBenefit = (index: number) => {
    if (benefits.length > 1) {
      const updatedBenefits = benefits.filter((_, i) => i !== index);
      setBenefits(updatedBenefits);
    }
  };

  const handlePrerequisiteChange = (index: number, value: any) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const handleDeletePrerequisite = (index: number) => {
    if (prerequisites.length > 1) {
      const updatedPrerequisites = prerequisites.filter((_, i) => i !== index);
      setPrerequisites(updatedPrerequisites);
    }
  };

  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill in the options fields before proceeding");
    }
  };

  return (
    <div className="w-[85%] m-auto mt-6">
      {/* Benefits section */}
      <div>
        <label className={`${styles.label} text-[20px] font-semibold block mb-2`}>
          What are the benefits for students in this course?
        </label>
        {benefits.map((benefit: any, index: number) => (
          <div className="w-full flex items-center my-2 gap-3" key={index}>
            <input
              type="text"
              name="Benefit"
              placeholder="e.g. Master industrial architecture and patterns..."
              required
              className={`${styles.input} !mt-0`}
              value={benefit.title}
              onChange={(e) => handleBenefitChange(index, e.target.value)}
            />
            {benefits.length > 1 && (
              <AiOutlineDelete
                className="cursor-pointer text-red-500 hover:text-red-700 transition-colors shrink-0"
                size={22}
                onClick={() => handleDeleteBenefit(index)}
              />
            )}
          </div>
        ))}
        <AiOutlinePlusCircle
          className="cursor-pointer text-[#37a39a] hover:text-[#2b847d] mt-2"
          size={30}
          onClick={handleAddBenefit}
        />
      </div>

      <br />
      <br />

      {/* Prerequisites section */}
      <div>
        <label className={`${styles.label} text-[20px] font-semibold block mb-2`}>
          What are the prerequisites for this course?
        </label>
        {prerequisites.map((prerequisite: any, index: number) => (
          <div className="w-full flex items-center my-2 gap-3" key={index}>
            <input
              type="text"
              name="Prerequisite"
              placeholder="e.g. Basic JavaScript knowledge and web fundamentals..."
              required
              className={`${styles.input} !mt-0`}
              value={prerequisite.title}
              onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
            />
            {prerequisites.length > 1 && (
              <AiOutlineDelete
                className="cursor-pointer text-red-500 hover:text-red-700 transition-colors shrink-0"
                size={22}
                onClick={() => handleDeletePrerequisite(index)}
              />
            )}
          </div>
        ))}
        <AiOutlinePlusCircle
          className="cursor-pointer text-[#37a39a] hover:text-[#2b847d] mt-2"
          size={30}
          onClick={handleAddPrerequisite}
        />
      </div>

      <div className="w-full flex items-center justify-between pt-8">
        <button
          onClick={() => setActive(active - 1)}
          className="w-[180px] h-[40px] bg-gray-500 text-center text-[#fff] rounded cursor-pointer font-Poppins font-medium hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleOptions}
          className="w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded cursor-pointer font-Poppins font-medium hover:bg-[#2b847d] transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default CourseOptions;
