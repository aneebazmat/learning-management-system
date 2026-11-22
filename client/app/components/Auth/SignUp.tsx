"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../styles/style";
import { useRegisterMutation, useSocialAuthMutation } from "../../../redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userRegistration } from "../../../redux/features/auth/authSlice";
import { signInWithFirebaseGoogle } from "../../utils/firebase";

interface Props {
  setRoute: (route: string) => void;
  setOpen?: (open: boolean) => void;
  refetch?: any;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6),
});

const SignUp: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess, isLoading }] = useRegisterMutation();
  const [socialAuth, { isLoading: isSocialLoading }] = useSocialAuthMutation();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const googleUser = await signInWithFirebaseGoogle();
      await socialAuth({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
      }).unwrap();
      toast.success(`Welcome, ${googleUser.name}!`);
      if (setOpen) setOpen(false);
      if (refetch) refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign up with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successful! Please check your email for the activation code.";
      toast.success(message);
      if (data?.activationToken) {
        dispatch(userRegistration({ token: data.activationToken }));
      }
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message || "Registration failed");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  }, [isSuccess, error, data, dispatch, setRoute]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      await register({ name, email, password });
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Join ELearning</h1>
      <form onSubmit={handleSubmit}>
        <div className="w-full mt-4">
          <label className={`${styles.label}`} htmlFor="name">
            Enter your Name
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="John Doe"
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block text-sm">
              {errors.name}
            </span>
          )}
        </div>

        <div className="w-full mt-4">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your Email
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="yourname@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${
              styles.input
            }`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block text-sm">
              {errors.email}
            </span>
          )}
        </div>

        <div className="w-full mt-4 relative">
          <label className={`${styles.label}`} htmlFor="password">
            Enter your password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password!@%"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-3 z-1 cursor-pointer dark:text-white text-black"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-3 z-1 cursor-pointer dark:text-white text-black"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block text-sm">
              {errors.password}
            </span>
          )}
        </div>

        <div className="w-full mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.button} ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <button
            type="button"
            disabled={isGoogleLoading || isSocialLoading}
            className="cursor-pointer mr-3 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            onClick={handleGoogleSignIn}
            title="Sign up with Google"
          >
            <FcGoogle size={24} />
          </button>
          <button
            type="button"
            className="cursor-pointer ml-3 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setRoute("Github-Auth")}
            title="Sign up with GitHub"
          >
            <AiFillGithub size={24} className="dark:text-white text-black" />
          </button>
        </div>

        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Already have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer hover:underline"
            onClick={() => setRoute("Login")}
          >
            Sign in
          </span>
        </h5>
      </form>
    </div>
  );
};

export default SignUp;
