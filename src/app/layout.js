import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/shared/Navbar/page";
import Footer from "@/app/shared/Footer/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bookora",
  description: "Your Local Library",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main>
        {children}
        </main>
        <Footer />

      </body>
    </html>
  );
}
