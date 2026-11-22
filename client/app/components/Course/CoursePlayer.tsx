"use client";
import React, { FC } from "react";

interface Props {
  videoUrl: string;
  title?: string;
}

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  // Extract embed URL for YouTube, Vimeo, or standard video files
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const trimmed = url.trim();

    // Already an embed URL
    if (trimmed.includes("youtube.com/embed/") || trimmed.includes("youtube-nocookie.com/embed/")) {
      return trimmed;
    }

    // Comprehensive YouTube URL parsing (handles watch?v=ID, youtu.be/ID, shorts/ID, and playlists &list=...)
    const ytMatch = trimmed.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );

    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
    }

    // Vimeo URL parsing
    if (trimmed.includes("vimeo.com")) {
      const vimeoMatch = trimmed.match(
        /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/
      );
      if (vimeoMatch && vimeoMatch[3]) {
        return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
      }
    }

    return trimmed;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isEmbeddable =
    embedUrl.includes("youtube.com") ||
    embedUrl.includes("youtube-nocookie.com") ||
    embedUrl.includes("vimeo.com");

  return (
    <div className="relative pt-[56.25%] 700px:pt-[56.25%] overflow-hidden rounded-xl shadow-2xl bg-black">
      {isEmbeddable ? (
        <iframe
          src={embedUrl}
          title={title || "Course Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="border-0 w-full h-full absolute top-0 left-0"
        />
      ) : (
        <video
          src={
            videoUrl ||
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          }
          controls
          className="border-0 w-full h-full absolute top-0 left-0 object-cover"
        />
      )}
    </div>
  );
};

export default CoursePlayer;
