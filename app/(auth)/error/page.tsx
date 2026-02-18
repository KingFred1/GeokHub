"use client";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "Something went wrong. Please try again.";

  if (error === "OAuthAccountNotLinked") {
    errorMessage =
      "An account with your email already exists. Please sign in using the method you originally used (e.g., password instead of Google).";
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 text-white p-10">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}
