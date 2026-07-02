"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/actions/register";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  const [state, action, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      return await registerAction(formData);
    },
    null
  );

  return (
    <div className="flex-1 flex items-center justify-center bg-muted/20 px-4 py-12 h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create an account to save your playgrounds</CardDescription>
        </CardHeader>
        <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">Name (optional)</label>
            <Input id="name" name="name" type="text" autoComplete="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input id="password" name="password" type="password" autoComplete="new-password" required />
          </div>
          {state?.error && (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "Sign Up"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4 text-primary hover:underline">Sign in</Link>
          </div>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
}
