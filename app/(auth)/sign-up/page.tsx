"use client";

import { Form, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { EyeOff, Eye } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpAction } from "@/lib/actions/auth-actions";
import { SignUpFormValues, signUpFormSchema } from "@/schemas";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

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

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      provider: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      const res = await signUpAction({ ...values, provider: "credentials" });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
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
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage aria-live="polite" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
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

                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="absolute top-0 right-0 h-10 w-10 px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={-1} // Prevents tab focus, as it's a secondary action
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
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Eye className="text-muted-foreground h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Password must be 6 characters or more with one uppercase letter
                and one special character.
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
          aria-disabled={isPending}
        >
          {isPending ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
