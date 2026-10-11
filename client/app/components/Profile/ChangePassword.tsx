"use client";
import React, { FC, useState, useEffect } from "react";
import { styles } from "../../styles/style";
import { useUpdatePasswordMutation } from "../../../redux/features/auth/authApi";
import { toast } from "react-hot-toast";

interface Props {}

const ChangePassword: FC<Props> = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error, isLoading }] =
    useUpdatePasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message || "Failed to update password");
      } else {
        toast.error("Error updating password");
      }
    }
  }, [isSuccess, error]);

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    await updatePassword({ oldPassword, newPassword });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-[25px] font-Poppins text-center font-[600] text-black dark:text-white pb-6">
          Change Password
        </h1>
        <form onSubmit={passwordChangeHandler} className="space-y-5">
          <div>
            <label className={`${styles.label}`}>Enter your old password</label>
            <input
              type="password"
              className={`${styles.input}`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <label className={`${styles.label}`}>Enter your new password</label>
            <input
              type="password"
              className={`${styles.input}`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className={`${styles.label}`}>Confirm your new password</label>
            <input
              type="password"
              className={`${styles.input}`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`${styles.button} ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
