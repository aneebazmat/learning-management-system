"use client";
import React, { FC, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

const faqData = [
  {
    question: "Will I receive a certificate of completion after finishing a course?",
    answer: "Yes, once you complete all lectures, assignments, and module quizzes, you will receive an industry-recognized certificate of completion with a verifiable credential link.",
  },
  {
    question: "Can I access course materials and video lectures on mobile devices?",
    answer: "Absolutely. Our platform is completely responsive across desktops, laptops, tablets, and smartphones with high-definition video playback.",
  },
  {
    question: "How do I ask questions if I get stuck while following along?",
    answer: "Each course includes an interactive Q&A discussion tab directly beneath the video player where instructors and teaching assistants answer your questions promptly.",
  },
  {
    question: "Do courses come with lifetime access?",
    answer: "Yes! Once enrolled in any course, you retain lifetime access to all included lectures, source code repositories, and future curriculum updates at no extra cost.",
  },
];

const FAQ: FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="w-[90%] 800px:w-[85%] m-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight">
          Frequently Asked{" "}
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#2190ff] to-[#37a39a]">
            Questions
          </span>
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto font-Poppins">
          Find answers to common questions about enrollment, access, curriculum, and certificates.
        </p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-800">
        {faqData.map((item, index) => (
          <div key={index} className="py-4">
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
            >
              <span className="text-base sm:text-lg font-Poppins font-medium text-black dark:text-white">
                {item.question}
              </span>
              <span className="ml-4 text-black dark:text-white">
                {activeQuestion === index ? (
                  <HiMinus size={22} className="text-[#37a39a]" />
                ) : (
                  <HiPlus size={22} />
                )}
              </span>
            </button>
            {activeQuestion === index && (
              <div className="pt-2 pb-4 text-sm sm:text-base font-Poppins text-gray-600 dark:text-gray-300 transition-all">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
