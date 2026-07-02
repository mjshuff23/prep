"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

const failedAttempts = new Map<string, { count: number; timestamp: number }>();

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  
  if (email) {
    const attempt = failedAttempts.get(email);
    if (attempt && attempt.count >= 5 && Date.now() - attempt.timestamp < 15 * 60 * 1000) {
      return { error: "Too many failed attempts. Please try again later." };
    }
  }

  try {
    await signIn("credentials", Object.fromEntries(formData));
    if (email) failedAttempts.delete(email);
  } catch (error) {
    if (error instanceof AuthError) {
      if (email) {
        const attempt = failedAttempts.get(email) || { count: 0, timestamp: Date.now() };
        failedAttempts.set(email, { count: attempt.count + 1, timestamp: Date.now() });
      }
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut();
}
