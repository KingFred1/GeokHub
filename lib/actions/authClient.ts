import { signIn } from "next-auth/react";

export async function signInWithCredentialsClient(credentials: { email: string; password: string }) {
  try {
    const result = await signIn("credentials", { ...credentials, redirect: false });
    // signIn can return undefined in some cases; normalize response
    if (!result) return { success: false, error: "Authentication failed" };

    // result may be an object when using redirect: false
    // Check for an error property
    if ((result as any).error) {
      return { success: false, error: (result as any).error };
    }

    return { success: (result as any).ok ?? true };
  } catch (err) {
    console.error("signInWithCredentialsClient error:", err);
    return { success: false, error: "Unexpected error during sign in" };
  }
}

export async function signUpClient(payload: { name: string; email: string; password: string }) {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("signUpClient error:", err);
    return { success: false, error: "Unexpected error during sign up" };
  }
}
