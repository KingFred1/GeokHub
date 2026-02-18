"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { checkUserExists } from "@/lib/actions/checkUserExists"; // import the server action

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (status === "unauthenticated") {
        const email = localStorage.getItem("userEmail");
        if (email) {
          const exists = await checkUserExists(email); // ✅ server call
          setUserExists(exists);
        }
        setLoading(false);
      }
    };

    check();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="w-20 h-10 animate-pulse bg-gray-200 rounded-md"></div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {session?.user ? (
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">{session.user.name}</span>
          <Link href="/profile">
            <Avatar>
              <AvatarFallback>
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  session.user.name?.charAt(0)
                )}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      ) : userExists ? (
        <Link
          href="/sign-in"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      ) : (
        <Link
          href="/sign-up"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </Link>
      )}
    </div>
  );
}
