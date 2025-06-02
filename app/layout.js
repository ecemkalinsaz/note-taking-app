import "./globals.css";
import { Open_Sans } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import PromptPanel from "@/components/PromptPanel";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Note Taking App",
  description: "A minimal note taking app with folders and emojis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="flex h-screen w-full bg-[#f8f7fd]">
          <Sidebar />
          {children}
          <PromptPanel />
        </main>
      </body>
    </html>
  );
}
