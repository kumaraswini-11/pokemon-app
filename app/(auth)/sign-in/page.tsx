"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Link, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SignInFormValues, signInFormSchema } from "@/schemas";
import { credentialSignInAction } from "@/lib/actions/auth-actions";

interface SignInResponse {
  success: boolean;
  error?: string;
}

export function SignInPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const iconVariants = {
    // Animation variants for the eye icon toggle
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

  // 1. Define your form.
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight not-dark:text-gray-900">
            Sign In
          </CardTitle>
          <CardDescription className="not-dark:text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          {/* OAuth SignIn Buttons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "flex items-center justify-center gap-3",
                className
              )}
              onClick={() => signIn("google")}
              disabled={isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <span className="capitalize">Sign in with Google</span>
            </Button>
          </div>

          {/* Separator */}
          <div className="after:border-border relative my-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2 not-dark:text-gray-500">
              Or continue with
            </span>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passsword */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          placeholder="Password"
                          disabled={isPending}
                          aria-label="Password"
                          aria-required="true"
                          autoComplete="current-password"
                          className="h-10 pr-10"
                        />
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

                    {/* Forgot password */}
                    <div className="flex justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-primary text-xs font-medium hover:underline hover:underline-offset-4"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={cn(
                  "mt-2 w-full",
                  "flex items-center justify-center gap-2"
                )}
                size="lg"
                disabled={isPending}
                aria-disabled={isPending}
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

        <CardFooter className="mx-auto -mt-3">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href=""
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
