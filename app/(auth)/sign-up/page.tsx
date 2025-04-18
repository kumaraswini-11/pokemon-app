"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {Eye, EyeOff} from "lucide-react";
import {AnimatePresence, motion} from "motion/react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";

import {SocialOAuthButton} from "@/components/shared/social-oauth-button";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {signUpAction, socialSignInAction} from "@/lib/actions/auth-actions";
import {cn} from "@/lib/utils";
import {SignUpFormValues, signUpFormSchema} from "@/schemas";

interface SignUpResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Animation variants for the eye icon toggle
  const iconVariants = {
    hidden: {opacity: 0, scale: 0.8},
    visible: {
      opacity: 1,
      scale: 1,
      transition: {duration: 0.2, ease: "easeInOut"},
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {duration: 0.2, ease: "easeInOut"},
    },
  };

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      provider: "",
    },
  });

  const {mutate, isPending} = useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      const res = await signUpAction({...values, provider: "credentials"});
      if (!res.success) {
        throw new Error(res.error || "An unexpected error occurred");
      }
      return res;
    },
    onSuccess: (res: SignUpResponse) => {
      toast.success(res.message || "Sign-up successful!", {
        description: new Date().toISOString(),
      });
      router.push("/sign-in");
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred");
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: SignUpFormValues) => {
    if (isPending) return; // Guard against double submission

    mutate(values);
  };

  return (
    <div className={cn("flex w-full max-w-md flex-col gap-6")}>
      <Card className="shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight not-dark:text-gray-900">
            Create an Account
          </CardTitle>
          <CardDescription className="not-dark:text-gray-600">
            Enter your details to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          {/* Social Authentication with OAuth (Google, etc.) */}
          <div className="grid grid-cols-1 gap-4">
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
              disabled={isPending}
            />
          </div>

          {/* Separator */}
          <div className="my-2 flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs">Or continue with</span>
            <Separator className="flex-1" />
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="name"
                      className="sr-only">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        disabled={isPending}
                        aria-required="true"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="email"
                      className="sr-only">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        disabled={isPending}
                        autoComplete="email"
                        autoCapitalize="none"
                        aria-required="true"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="password"
                      className="sr-only">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          disabled={isPending}
                          aria-label="Password"
                          aria-required="true"
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        {/* Toggle password visibility with animation */}
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="absolute top-0 right-0 h-10 w-10 px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          tabIndex={-1} // Prevents tab focus, as it's a secondary action
                        >
                          <AnimatePresence mode="popLayout">
                            {showPassword ? (
                              <motion.div
                                key="eye-off"
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit">
                                <EyeOff className="text-muted-foreground size-4" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="eye"
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit">
                                <Eye className="text-muted-foreground size-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Password must be 6 characters or more with one uppercase letter and one
                      special character.
                    </FormDescription>

                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isPending}
                aria-disabled={isPending}>
                {isPending ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="mx-auto -mt-3">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-medium hover:underline hover:underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
