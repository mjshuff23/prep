import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

export function assertOwner(resourceUserId: string, currentUserId?: string) {
  if (!currentUserId || resourceUserId !== currentUserId) {
    throw new Error("Unauthorized: You do not have permission to access this resource.");
  }
}
