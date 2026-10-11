"use client";
import React, { FC } from "react";

interface Props {
  videoUrl: string;
  title?: string;
}

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  // Convert standard YouTube watch URL to embed URL if applicable
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isEmbeddable = embedUrl.includes("youtube.com") || embedUrl.includes("vimeo.com");

  return (
    <div className="relative pt-[56.25%] 700px:pt-[56.25%] overflow-hidden rounded-xl shadow-2xl bg-black">
      {isEmbeddable ? (
        <iframe
          src={embedUrl}
          title={title || "Course Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
