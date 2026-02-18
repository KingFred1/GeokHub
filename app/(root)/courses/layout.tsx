// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "@/provider/theme-provider";
// import { Toaster } from "@/components/ui/sonner";
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import AppSidebar from "@/components/global/app-sidebar";
// import UpperInfoBar from "@/components/global/upper-info-bar";
// import { SessionProvider } from "next-auth/react";




// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "iBlogX",
//   description: "The best blog site",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <SessionProvider>
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased `}
//         suppressHydrationWarning
//       >
//         <SidebarProvider> {/* Move this inside <body> */}
//           <ThemeProvider
//             attribute={'class'}
//             defaultTheme="dark"
//             enableSystem
//             disableTransitionOnChange
//           >
//             <AppSidebar />
//             <SidebarInset>
//               <UpperInfoBar />
//               {children}
//             </SidebarInset>
//             <Toaster />
//           </ThemeProvider>
//         </SidebarProvider>
//       </body>
//     </html>
//     </SessionProvider>
//   );
// }
