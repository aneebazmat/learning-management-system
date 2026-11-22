/**
 * Default avatar constants and utility functions.
 * Uses a clean, professional, modern tech developer avatar.
 */

export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

/**
 * Returns a safe, modern male/neutral developer avatar URL.
 * Automatically catches and replaces the old woman portrait fallback (photo-1534528741775-53994a69daeb).
 */
export const getSafeAvatar = (avatarUrl?: string | null): string => {
  if (!avatarUrl || avatarUrl.includes("1534528741775-53994a69daeb") || avatarUrl.trim() === "") {
    return DEFAULT_AVATAR;
  }
  return avatarUrl;
};
