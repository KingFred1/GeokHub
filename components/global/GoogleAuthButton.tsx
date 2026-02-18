'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function GoogleAuthButton() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  return (
    <div className="w-full h-full items-center flex justify-center">
      <div className="bg-white/20 dark:bg-white/10 backdrop-blur-lg border border-white/30 dark:border-white/20 rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-md text-center text-white transition duration-300">
        <h1 className="text-3xl font-bold mb-4">
          {isAuthenticated ? `Welcome, ${user?.name?.split(' ')[0]}` : 'Sign in to iBlogX'}
        </h1>
        <p className="text-white/90 mb-6 text-sm md:text-base">
          {isAuthenticated
            ? 'Here’s your account overview. You can sign out anytime.'
            : 'Sign in with Google to access your personalized content.'}
        </p>

        {status === 'loading' ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <>
            <div className="flex flex-col items-center gap-2 mb-6">
              {user?.image && (
                <Image
                  src={user.image}
                  alt="User Avatar"
                  width={64}
                  height={64}
                  className="rounded-full ring-2 ring-white"
                />
              )}
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-white/80">{user.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full bg-red-600 hover:bg-red-500 transition px-6 py-3 rounded-xl font-medium text-white"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex items-center justify-center gap-3 w-full bg-white text-black hover:bg-gray-100 transition px-6 py-3 rounded-xl font-medium shadow-lg"
          >
            <Image
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              width={20}
              height={20}
            />
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}
