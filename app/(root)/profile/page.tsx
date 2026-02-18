import { auth } from "@/auth";
import GoogleAuthButton from "@/components/global/GoogleAuthButton";
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View and manage your profile',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

async function ProfileContent() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex-col justify-center -full bg-gray-800 dark:from-gray-900 dark:via-black dark:to-gray-800 animate-gradient flex items-center p-4">
      {user ? (
        <>
          <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}</h1>
          <p className="text-gray-600 text-sm mb-4">You&apos;re logged in as {user.email}</p>
        </>
      ) : (
        <h1 className="text-2xl text-white font-bold text-center mb-4">
          Sign in to continue
        </h1>
      )}
      <GoogleAuthButton isAuthenticated={!!user} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}