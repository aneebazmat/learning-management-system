"use client";
import React, { FC, useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { useSocialAuthMutation } from "../../../redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { styles } from "../../styles/style";

interface Props {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: any;
}

const GithubAuth: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [socialAuth, { isLoading }] = useSocialAuthMutation();
  const [githubUsername, setGithubUsername] = useState("");
  const [githubEmail, setGithubEmail] = useState("");
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [fetchedUser, setFetchedUser] = useState<{
    login: string;
    name: string;
    avatar_url: string;
    email: string;
  } | null>(null);

  const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

  const handleOAuthPopup = () => {
    if (!githubClientId) {
      toast.error(
        "GitHub OAuth Client ID is not configured in client/.env.local (NEXT_PUBLIC_GITHUB_CLIENT_ID)"
      );
      return;
    }
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/github`);
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
    window.location.href = githubUrl;
  };

  const handleFetchGitHubUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = githubUsername.trim();
    if (!username) {
      toast.error("Please enter your GitHub username");
      return;
    }

    setIsFetchingProfile(true);
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
      if (!res.ok) {
        throw new Error("GitHub user not found. Please check the username.");
      }
      const data = await res.json();
      setFetchedUser({
        login: data.login,
        name: data.name || data.login,
        avatar_url: data.avatar_url,
        email: data.email || githubEmail || `${data.login}@users.noreply.github.com`,
      });
      if (!githubEmail && data.email) {
        setGithubEmail(data.email);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load GitHub profile");
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const handleConfirmSignIn = async () => {
    if (!fetchedUser) return;
    const finalEmail = (githubEmail || fetchedUser.email).trim();
    if (!finalEmail) {
      toast.error("Please enter an email address for your account");
      return;
    }

    try {
      await socialAuth({
        email: finalEmail,
        name: fetchedUser.name,
        avatar: fetchedUser.avatar_url,
      }).unwrap();

      toast.success(`Signed in as ${fetchedUser.name}!`);
      setOpen(false);
      if (refetch) refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "GitHub authentication failed");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-12 h-12 rounded-full bg-gray-900 text-white shadow-md flex items-center justify-center mb-3">
          <AiFillGithub size={32} />
        </div>
        <h2 className="text-xl font-Poppins font-semibold text-gray-900 dark:text-white">
          Sign in with GitHub
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-Poppins">
          Connect your original GitHub profile and avatar
        </p>
      </div>

      {/* Body */}
      <div className="py-4 space-y-4">
        {githubClientId && (
          <button
            type="button"
            onClick={handleOAuthPopup}
            className={`${styles.button} flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800`}
          >
            <AiFillGithub size={22} />
            <span>Open GitHub OAuth Window</span>
          </button>
        )}

        {!fetchedUser ? (
          <form onSubmit={handleFetchGitHubUser} className="space-y-3">
            <div>
              <label htmlFor="github-username-input" className={styles.label}>Enter your GitHub Username</label>
              <input
                id="github-username-input"
                name="githubUsername"
                type="text"
                autoComplete="username"
                required
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. torvalds, octocat"
                className={styles.input}
              />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Fetches your real GitHub profile, photo, and details directly from GitHub API.
              </p>
            </div>

            <button
              type="submit"
              disabled={isFetchingProfile}
              className={`${styles.button} flex items-center justify-center gap-2`}
            >
              <span>{isFetchingProfile ? "Finding on GitHub..." : "Fetch Real GitHub Profile"}</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/80">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-[#37a39a] flex-shrink-0">
                <Image
                  src={fetchedUser.avatar_url}
                  alt={fetchedUser.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {fetchedUser.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  @{fetchedUser.login}
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="github-email-input" className={styles.label}>Account Email</label>
              <input
                id="github-email-input"
                name="githubEmail"
                type="email"
                autoComplete="email"
                required
                value={githubEmail || fetchedUser.email}
                onChange={(e) => setGithubEmail(e.target.value)}
                placeholder="your.email@example.com"
                className={styles.input}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFetchedUser(null)}
                className="w-1/3 py-2 px-3 text-xs border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Change User
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleConfirmSignIn}
                className="flex-1 py-2 px-3 text-xs bg-[#37a39a] text-white rounded-lg font-medium hover:bg-[#2b837b] transition-colors"
              >
                {isLoading ? "Signing in..." : "Sign In with this Profile"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <button
          type="button"
          onClick={() => setRoute("Login")}
          className="hover:text-[#37a39a] transition-colors"
        >
          ← Back to Login
        </button>
        <span className="text-[11px]">Real GitHub API</span>
      </div>
    </div>
  );
};

export default GithubAuth;
