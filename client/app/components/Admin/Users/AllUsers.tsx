"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "../../../../redux/features/auth/authApi";
import { getSafeAvatar } from "../../../utils/avatar";
import {
  AiOutlineDelete,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineClose,
} from "react-icons/ai";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineSchool,
  MdOutlineVerified,
  MdOutlineSupervisorAccount,
} from "react-icons/md";
import { toast } from "react-hot-toast";

interface Props {}

const AllUsers: FC<Props> = () => {
  const { data, isLoading, refetch } = useGetAllUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [userToChangeRole, setUserToChangeRole] = useState<any | null>(null);

  const users = data?.users || [];

  const filteredUsers = users.filter((u: any) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const totalAdmins = users.filter((u: any) => u.role === "admin").length;
  const totalStudents = users.filter((u: any) => u.role === "user" || !u.role).length;
  const verifiedCount = users.filter((u: any) => u.isVerified).length;

  const handleRoleToggle = async (user: any) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await updateUserRole({ id: user._id, role: newRole }).unwrap();
      toast.success(`Role for ${user.name || user.email} updated to ${newRole}`);
      setUserToChangeRole(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete?._id) return;
    try {
      await deleteUser(userToDelete._id).unwrap();
      toast.success(`User ${userToDelete.name || userToDelete.email} deleted successfully`);
      setUserToDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-6 800px:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col 800px:flex-row 800px:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-Poppins font-bold text-black dark:text-white flex items-center gap-2">
            <MdOutlineSupervisorAccount className="text-[#37a39a]" size={28} />
            User Management
          </h2>
          <p className="text-sm font-Poppins text-gray-500 mt-1">
            View active learners, assign instructor/admin privileges, and manage account statuses.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-black dark:text-white text-xs font-Poppins font-medium rounded-lg transition-colors self-start 800px:self-auto"
        >
          Refresh List
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 1000px:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-Poppins text-gray-500 font-medium">Total Registered</span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#37a39a] flex items-center justify-center">
              <MdOutlineSchool size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold font-Poppins text-black dark:text-white mt-2">
            {isLoading ? "..." : totalUsers}
          </p>
          <span className="text-[11px] text-gray-400 font-Poppins">Platform learners & team</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-Poppins text-gray-500 font-medium">Administrators</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <MdOutlineAdminPanelSettings size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold font-Poppins text-black dark:text-white mt-2">
            {isLoading ? "..." : totalAdmins}
          </p>
          <span className="text-[11px] text-purple-500 font-Poppins">Privileged admins</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-Poppins text-gray-500 font-medium">Regular Students</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <MdOutlineSchool size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold font-Poppins text-black dark:text-white mt-2">
            {isLoading ? "..." : totalStudents}
          </p>
          <span className="text-[11px] text-blue-500 font-Poppins">Standard enrolled learners</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-Poppins text-gray-500 font-medium">Verified Accounts</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <MdOutlineVerified size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold font-Poppins text-black dark:text-white mt-2">
            {isLoading ? "..." : verifiedCount}
          </p>
          <span className="text-[11px] text-emerald-500 font-Poppins">Email-authenticated</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex flex-col 800px:flex-row gap-3 items-center justify-between">
        <div className="relative w-full 800px:w-[320px]">
          <AiOutlineSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="admin-user-search"
            name="user_search"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-Poppins bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#37a39a]"
          />
        </div>

        <div className="flex items-center gap-2 w-full 800px:w-auto overflow-x-auto pb-1 800px:pb-0">
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-Poppins font-medium transition-colors ${
              roleFilter === "all"
                ? "bg-[#37a39a] text-white"
                : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            All Roles ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter("admin")}
            className={`px-3 py-1.5 rounded-lg text-xs font-Poppins font-medium transition-colors ${
              roleFilter === "admin"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            Admins ({totalAdmins})
          </button>
          <button
            onClick={() => setRoleFilter("user")}
            className={`px-3 py-1.5 rounded-lg text-xs font-Poppins font-medium transition-colors ${
              roleFilter === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            Students ({totalStudents})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-[#37a39a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-Poppins text-gray-500">Loading user database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <MdOutlineSchool size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h4 className="font-Poppins font-semibold text-black dark:text-white text-base">
              No users found
            </h4>
            <p className="text-xs font-Poppins text-gray-400 mt-1">
              Try adjusting your search criteria or role filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-Poppins text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Enrolled Courses</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredUsers.map((user: any) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#37a39a]/40 flex-shrink-0">
                          <Image
                            src={getSafeAvatar(user.avatar?.url)}
                            alt={user.name || "User"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-black dark:text-white leading-tight">
                            {user.name || "Anonymous Learner"}
                          </p>
                          <span
                            className={`text-[10px] inline-block mt-0.5 px-1.5 py-0.2 rounded font-medium ${
                              user.isVerified
                                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
                                : "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40"
                            }`}
                          >
                            {user.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 text-xs">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                            : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-black dark:text-white">
                        {user.courses?.length || 0}
                      </span>{" "}
                      {user.courses?.length === 1 ? "Course" : "Courses"}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Send Email */}
                        <a
                          href={`mailto:${user.email}?subject=Message%20from%20Course%20Administrator`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#37a39a] hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors"
                          title={`Email ${user.name || user.email}`}
                        >
                          <AiOutlineMail size={17} />
                        </a>

                        {/* Toggle Role */}
                        <button
                          onClick={() => setUserToChangeRole(user)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#37a39a] text-gray-700 dark:text-gray-200 hover:text-[#37a39a] transition-colors"
                          title="Change user privileges"
                        >
                          {user.role === "admin" ? "Demote" : "Promote"}
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete user account"
                        >
                          <AiOutlineDelete size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Change Confirmation Modal */}
      {userToChangeRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-Poppins font-bold text-lg text-black dark:text-white">
                Change User Role
              </h3>
              <button
                onClick={() => setUserToChangeRole(null)}
                className="text-gray-400 hover:text-black dark:hover:text-white"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            <p className="text-sm font-Poppins text-gray-600 dark:text-gray-300">
              Are you sure you want to change the role of{" "}
              <span className="font-semibold text-black dark:text-white">
                {userToChangeRole.name || userToChangeRole.email}
              </span>{" "}
              from{" "}
              <span className="uppercase font-bold text-[#37a39a]">
                {userToChangeRole.role || "user"}
              </span>{" "}
              to{" "}
              <span className="uppercase font-bold text-purple-500">
                {userToChangeRole.role === "admin" ? "user" : "admin"}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToChangeRole(null)}
                className="px-4 py-2 text-xs font-Poppins rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRoleToggle(userToChangeRole)}
                disabled={isUpdatingRole}
                className="px-4 py-2 text-xs font-Poppins font-medium rounded-lg bg-[#37a39a] hover:bg-[#2e8880] text-white disabled:opacity-50"
              >
                {isUpdatingRole ? "Updating..." : "Confirm Role Change"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-Poppins font-bold text-lg text-red-600 flex items-center gap-2">
                <AiOutlineDelete size={22} />
                Delete Account
              </h3>
              <button
                onClick={() => setUserToDelete(null)}
                className="text-gray-400 hover:text-black dark:hover:text-white"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            <p className="text-sm font-Poppins text-gray-600 dark:text-gray-300">
              This action is permanent. All progress, course enrollments, and profile data for{" "}
              <span className="font-semibold text-black dark:text-white">
                {userToDelete.name || userToDelete.email}
              </span>{" "}
              will be permanently removed.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-Poppins rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeletingUser}
                className="px-4 py-2 text-xs font-Poppins font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isDeletingUser ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
