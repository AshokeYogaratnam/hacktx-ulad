import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

export const metadata: Metadata = {
  title: "Toyota Financial Navigator",
  description:
    "AI-powered financial wellness platform for personalized Toyota vehicle financing",
  keywords:
    "Toyota, financing, financial wellness, AI, vehicle financing, personal finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Chatbot />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
