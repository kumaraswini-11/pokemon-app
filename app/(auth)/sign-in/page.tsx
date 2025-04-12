"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SignInFormValues, signInFormSchema } from "@/schemas";
import {
  credentialSignInAction,
  socialSignInAction,
} from "@/lib/actions/auth-actions";
import { Separator } from "@/components/ui/separator";
import { SocialOAuthButton } from "@/components/shared/social-oauth-button";

interface SignInResponse {
  success: boolean;
  error?: string;
}

export default function SignInPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Animation config for password icon transitions
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  // 1. Initialize the sign-in form
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Credential-based sign-in mutation
  const { mutate, isPending } = useMutation({
    mutationFn: credentialSignInAction,
    onSuccess: (res: SignInResponse) => {
      if (res.success) {
        toast.success("Sign-in successful!", {
          description: new Date().toISOString(),
        });

        router.push("/"); // Perform client-side redirect
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred");
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: SignInFormValues) => {
    if (isPending) return; // Guard against double submission

    mutate(values); // Trigger the mutate function
  };

  return (
    <div
      className={cn("flex w-full max-w-md flex-col gap-6", className)}
      {...props}
    >
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
          <div className="grid grid-cols-1 gap-4">
            <SocialOAuthButton
              provider="google"
              label="Sign in with Google"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
              }
              formAction={socialSignInAction}
              disabled={isPending}
              className={className}
            />
          </div>

          {/* Visual Separator */}
          <div className="my-2 flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs">
              Or continue with
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Email/Password Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              {/* Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        disabled={isPending}
                        autoComplete="email"
                        autoCapitalize="none"
                        aria-required="true"
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              {/* Password Input with Toggle */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password" className="justify-between">
                      Password
                      {/* Forgot Password Link */}
                      <div className="flex justify-end">
                        <Link
                          href="/forgot-password"
                          className="text-primary text-xs font-medium hover:underline hover:underline-offset-4"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          disabled={isPending}
                          autoComplete="current-password"
                          aria-label="Password"
                          aria-required="true"
                          className="h-10 pr-10"
                        />
                        {/* Toggle Password Visibility */}
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="absolute top-0 right-0 h-10 w-10 px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          <AnimatePresence mode="popLayout">
                            {showPassword ? (
                              <motion.div
                                key="eye-off"
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                              >
                                <EyeOff className="text-muted-foreground size-[18px]" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="eye"
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                              >
                                <Eye className="text-muted-foreground size-[18px]" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                aria-disabled={isPending}
                className={cn(
                  "mt-2 flex w-full items-center justify-center gap-2"
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        {/* Footer with Sign-up Redirect */}
        <CardFooter className="mx-auto -mt-3">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary font-medium hover:underline hover:underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
