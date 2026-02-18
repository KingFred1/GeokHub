"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, DefaultValues, Path, FieldValues } from "react-hook-form";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/lib/constant";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      const result = await onSubmit(data);

      if (result?.success) {
        toast.success(
          isSignIn
            ? "You have successfully signed in."
            : "You have successfully signed up."
        );

        // For sign-up flows, try to sign the user in automatically using next-auth
        if (!isSignIn && (data as any).email && (data as any).password) {
          try {
            const signInResult: any = await signIn("credentials", {
              email: (data as any).email,
              password: (data as any).password,
              redirect: false,
            });

            if (signInResult?.ok) {
              setTimeout(() => router.push("/profile"), 1000);
              return;
            }

            // If automatic sign-in failed, notify the user and direct them to sign-in
            toast.success("Account created! Please sign in.");
            setTimeout(() => router.push("/sign-in"), 1200);
            return;
          } catch (err) {
            console.error("Auto sign-in failed:", err);
            // Fallback - redirect to sign-in page
            setTimeout(() => router.push("/sign-in"), 800);
            return;
          }
        }

        // Default redirect for sign-in or if auto sign-in wasn't attempted
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error(
          result?.error || `Error ${isSignIn ? "signing in" : "signing up"}`
        );
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred while ${
          isSignIn ? "signing in" : "signing up"
        }`
      );
      console.error("Form submission error:", error);
    }
  };

  // Debug: Log form state changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-md  font-semibold text-white">
        {isSignIn ? "Welcome back to GeokHub" : "Create your GeokHub account"}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? ""
          : ""}
      </p>
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          {Object.keys(defaultValues).map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[fieldName as keyof typeof FIELD_NAMES] || 
                     fieldName.replace(/([A-Z])/g, ' $1').trim()}
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      type={
                        FIELD_TYPES[fieldName as keyof typeof FIELD_TYPES] || 
                        (fieldName.toLowerCase().includes("password") 
                          ? "password" 
                          : "text")
                      }
                      {...field}
                      className="w-full min-h-11 border-none text-base font-bold placeholder:font-normal text-white placeholder:text-gray-100 focus-visible:ring-0 focus-visible:shadow-none bg-gray-800 "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button 
            className="bg-blue-900  hover:bg-blue-800 inline-flex min-h-11 w-full items-center justify-center rounded-md px-6 py-2 font-bold text-base cursor-pointer" 
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting 
              ? "Processing..." 
              : isSignIn 
                ? "Sign In" 
                : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to GeokHub? " : "Already have an account? "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-gray-400 hover:text-gray-300 transition-colors"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;