"use client";

import Link from "next/link";

import {SignInForm} from "@/components/shared/sign-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {cn} from "@/lib/utils";

export default function SignInPage({className, ...props}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex w-full max-w-md flex-col gap-6", className)}
      {...props}>
      <Card className="shadow-md">
        {/* Header Section */}
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight not-dark:text-gray-900">
            Sign In
          </CardTitle>
          <CardDescription className="not-dark:text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          {/* Social Authentication Section */}
          {/* <div className="grid grid-cols-1 gap-4">
            <SocialOAuthButton
              provider="google"
              label="Sign in with Google"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
              }
              formAction={socialSignInAction}
              disabled={false}
              className={className}
            />
          </div> */}

          {/* Visual Separator */}
          {/* <div className="my-2 flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs">Or continue with</span>
            <Separator className="flex-1" />
          </div> */}

          {/* Email/Password Form */}
          <SignInForm />
        </CardContent>

        {/* Footer with Sign-up Redirect */}
        <CardFooter className="mx-auto -mt-3">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary font-medium hover:underline hover:underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
