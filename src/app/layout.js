import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata = {
  title: "Bookora | Your Local Library, Delivered",

  description:
    "Bookora connects readers with local libraries and independent book owners for convenient book delivery.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      data-theme="light"
    >
      <body>
         <Navbar />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}