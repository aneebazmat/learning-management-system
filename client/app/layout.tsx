import "./globals.css";
import { Providers } from "./Provider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "ELearning - Industrial LMS Platform",
  description: "ELearning is an industrial learning management system for students and instructors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        suppressHydrationWarning
        className="!bg-white bg-no-repeat dark:!bg-[#040c18] min-h-screen font-Poppins"
      >
        <Providers>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
