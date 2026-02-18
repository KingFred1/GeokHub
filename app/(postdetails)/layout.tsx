import UpperInfoBar from "@/components/global/upper-info-bar";
// globals moved to app/globals.css
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/provider/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UpperInfoBar />
      {children}
      <Footer />
    </>
  );
}
