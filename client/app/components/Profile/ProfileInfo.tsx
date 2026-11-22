"use client";
import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "../../styles/style";
import {
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} from "../../../redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { getSafeAvatar } from "../../utils/avatar";

interface Props {
  avatar: string | null;
  user: any;
}

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user?.name || "");
  const [updateProfile, { isSuccess: profileSuccess, error: profileError }] =
    useUpdateProfileMutation();
  const [updateAvatar, { isSuccess: avatarSuccess, error: avatarError }] =
    useUpdateAvatarMutation();

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const result = fileReader.result as string;
        updateAvatar({ avatar: result });
      }
    };
    if (e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (profileSuccess) {
      toast.success("Profile updated successfully!");
    }
    if (avatarSuccess) {
      toast.success("Profile photo updated successfully!");
    }
    if (profileError || avatarError) {
      toast.error("Failed to update profile details");
    }
  }, [profileSuccess, avatarSuccess, profileError, avatarError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await updateProfile({ name, email: user?.email });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl">
        <div className="relative w-[120px] h-[120px] mx-auto">
          <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-[#37a39a] shadow-lg">
            <Image
              src={getSafeAvatar(avatar || user?.avatar?.url)}
              alt="Profile"
              fill
              sizes="120px"
              className="object-cover"
            />
          </div>
          <input
            type="file"
            name="avatar"
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[34px] h-[34px] bg-slate-900 rounded-full absolute bottom-1 right-1 flex items-center justify-center cursor-pointer border-2 border-white shadow hover:bg-[#37a39a] transition-colors">
              <AiOutlineCamera size={20} className="text-white" />
            </div>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="profile-full-name" className={`${styles.label}`}>Full Name</label>
            <input
              id="profile-full-name"
              name="name"
              type="text"
              autoComplete="name"
              className={`${styles.input}`}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="profile-email-address" className={`${styles.label}`}>Email Address</label>
            <input
              id="profile-email-address"
              name="email"
              type="email"
              autoComplete="email"
              readOnly
              className={`${styles.input} bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-75`}
              value={user?.email || ""}
            />
          </div>
          <div className="pt-2">
            <button type="submit" className={`${styles.button}`}>
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
