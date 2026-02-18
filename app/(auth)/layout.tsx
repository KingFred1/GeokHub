'use client' 

import { redirect, usePathname } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { Toaster } from "sonner";
import Image from "next/image";
import { ThemeProvider } from "@/provider/theme-provider";
// globals moved to app/globals.css
import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";

// Client component wrapper
function AuthContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (session) {
      redirect("/");
    }
  }, [session, status, pathname]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="relative flex flex-col-reverse sm:flex-row min-h-screen">
      {/* Left/auth section */}
      <section
        className="flex flex-1 items-center justify-center bg-gray-900 px-4 py-6 sm:px-8 sm:py-10"
        // style={{ backgroundImage: "url('/images/pattern.webp')" }}
      >
        <div className="w-full max-w-md bg-gray-950 bg-opacity-80 backdrop-blur-md border border-gray-700 rounded-lg shadow-md p-6 sm:p-10 text-white">
          <div className="flex flex-row items-center gap-3 mb-2">
            <Image
              src="/icons/geokhub.png"
              alt="Logo"
              width={50}
              height={50}
            />
            <h1 className="text-xl font-semibold">
              GeokHub gateway
            </h1>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            }
          >
            <div>
              {children}
              <Toaster />
            </div>
          </Suspense>
        </div>
      </section>

      {/* Right/banner image section */}
      <section className="w-full md:sticky top-0 sm:w-1/2 h-48 sm:h-screen">
        <Image
          src="/images/banner1.png"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="w-full h-full object-cover"
        />
      </section>
    </main>
  );
}

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthContent>{children}</AuthContent>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Layout;