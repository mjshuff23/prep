"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  const emailVal = formData.get("email");
  const passwordVal = formData.get("password");
  const nameVal = formData.get("name");

  if (typeof emailVal !== "string" || typeof passwordVal !== "string") {
    return { error: "Email and password are required." };
  }

  const email = emailVal.trim().toLowerCase();
  const password = passwordVal;
  const name = typeof nameVal === "string" ? nameVal : undefined;

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { error: "Unable to create account. Please try again or sign in." };
    }
    throw error;
  }

  redirect("/sign-in?registered=true");
}
