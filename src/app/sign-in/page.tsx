"use client";

import { Suspense, useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

function SignInForm() {
  const [state, action, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      return await loginAction(formData);
    },
    null
  );

  return (
    <div className="flex-1 flex items-center justify-center bg-muted/20 px-4 py-12 h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        {useSearchParams().get("registered") === "true" && (
          <div className="bg-green-100/10 text-green-600 border border-green-600/20 p-3 mx-6 mb-4 rounded-md text-sm text-center">
            Registration successful! Please sign in.
          </div>
        )}
        <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
            </div>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {state?.error && (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4 text-primary hover:underline">Sign up</Link>
          </div>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center h-screen">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
