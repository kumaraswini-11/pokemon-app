"use server";

import axios from "axios";

import {signIn, signOut} from "@/auth";
import {SignInFormValues, SignUpFormValues} from "@/schemas";

import {axiosInstance} from "../utils";

export type SuccessResponse = {
  success: true;
  message: string;
};

export type ErrorResponse = {
  success?: false;
  error: string;
};

export type SocialProvider = "google" | "github";

export type Response = SuccessResponse | ErrorResponse;

export const signUpAction = async (signUpFormData: SignUpFormValues): Promise<Response> => {
  try {
    const response = await axiosInstance.post<SuccessResponse>("/auth/sign-up", signUpFormData);

    // Ensure the response data matches the expected structure
    if (response.data?.success && response.data?.message) {
      return {success: true, message: response.data.message};
    } else {
      return {success: false, error: "Unexpected server response"};
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      return {success: false, error: error.response.data.error};
    } else if (error instanceof Error) {
      return {success: false, error: error.message};
    } else {
      return {success: false, error: "An unknown error occurred"};
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function socialSignInAction(formData: FormData): Promise<any> {
  const provider = formData.get("provider") as SocialProvider;

  try {
    // Perform sign-in without server-side redirect
    await signIn(provider, {redirect: false});
    return {success: true};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const credentialSignInAction = async (values: SignInFormValues) => {
  try {
    await signIn("credentials", {
      ...values,
      redirect: false, // Prevent server-side redirect
    });

    // If sign-in succeeds, result is undefined (no redirect occurs)
    return {success: true};
  } catch (error) {
    // console.error("Sign-in error:", error);

    // Handle NextAuth-specific errors
    if (error instanceof Error && error.name === "CredentialsSignIn") {
      return {success: false, error: "Invalid email or password"};
    }

    // Fallback for unexpected errors
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export async function signOutAction() {
  try {
    // Perform sign-out without redirecting. By default, redirected to the current page.
    await signOut({redirect: false});
    return {success: true};
  } catch (error) {
    console.error("Sign-out error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
