"use client";
import AuthForm from "@/components/AuthForm";
import { signUpClient } from "@/lib/actions/authClient";
import { signUpSchema } from "@/lib/validations";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthForm
        type="SIGN_UP"
        schema={signUpSchema}
        defaultValues={{
          name: "",
          email: "",
          password: "",
        }}
        onSubmit={signUpClient}
      />

      <div className="flex items-center justify-center mt-2">
        <span className="border-b  border-gray-100 px-14 pt-1" />
        <span className="px-2 text-lg text-gray-100">or</span>
        <span className="border-b border-gray-100 px-14 pt-1" />
      </div>
      <div className="flex gap-3 items-center justify-center mt-4 rounded-md shadow-md border border-gray-700 p-1 hover:bg-gray-800 transition-colors">
        <Image
          src="/icons/google-icon.png"
          alt="Google Logo"
          width={25}
          height={25}
        />
        <button onClick={() => signIn("google", { callbackUrl: "/" })}>
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default page;
