import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {AnimatePresence, motion} from "motion/react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";

import {credentialSignInAction} from "@/lib/actions/auth-actions";
import {cn} from "@/lib/utils";
import {SignInFormValues, signInFormSchema} from "@/schemas";

import {Button} from "../ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {Input} from "../ui/input";

interface SignInResponse {
  success: boolean;
  error?: string;
}

export const SignInForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Animation config for password icon transitions
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

  // 1. Initialize the sign-in form
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Credential-based sign-in mutation
  const {mutate, isPending} = useMutation({
    mutationFn: credentialSignInAction,
    onSuccess: (res: SignInResponse) => {
      if (res.success) {
        toast.success("Sign-in successful!", {
          description: new Date().toISOString(),
        });

        router.push("/"); // Perform client-side redirect
      }

      if (res?.error) {
        // console.log(res);
        toast.error("Invalid Credential");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4">
        {/* Email Input */}
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
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
          render={({field}) => (
            <FormItem>
              <FormLabel
                htmlFor="password"
                className="justify-between">
                Password
                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-primary text-xs font-medium hover:underline hover:underline-offset-4">
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
                    aria-label={showPassword ? "Hide password" : "Show password"}>
                    <AnimatePresence mode="popLayout">
                      {showPassword ? (
                        <motion.div
                          key="eye-off"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit">
                          <EyeOff className="text-muted-foreground size-[18px]" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit">
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
          className={cn("mt-2 flex w-full items-center justify-center gap-2")}>
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
  );
};
