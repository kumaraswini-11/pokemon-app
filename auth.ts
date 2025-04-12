import { eq } from "drizzle-orm";
import NextAuth, { type User } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { db } from "./db/drizzle";
import { usersTable } from "./db/schema";
import { signInFormSchema } from "./schemas";
// import { verifyPassword } from "./lib/password-utils";

/**
 * Configure authentication providers
 * @see https://authjs.dev/getting-started/providers
 */
const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    authorization: {
      params: {
        access_type: "offline", // Google requires "offline" access_type to provide a `refresh_token`
        prompt: "consent", // Force consent screen (every time)
        response_type: "code",
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
  }),
  Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      try {
        const parsedCredentials = signInFormSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error("Invalid input");
        }

        const { email, password } = parsedCredentials.data;

        // logic to verify if the user exists
        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.email, email),
        });
        if (!user) {
          // No user found, so this is their first attempt to signin
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        }

        // // Verify the password
        // const isPasswordValid = await verifyPassword(
        //   password,
        //   user.passwordHash
        // );
        // if (!isPasswordValid) throw new Error("Invalid credentials.");

        // return user object with their profile data
        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
        } as User;
      } catch (error) {
        console.error("Authentication error:", error);
        return null;
      }
    },
  }),
];

/**
 * Auth.js configuration
 * @see https://authjs.dev/reference/nextjs
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days - explicitly set instead of default
  },
  providers,
  pages: {
    signIn: "/sign-in",
    // error: "/auth/error",
    // verifyRequest: "/auth/verify-request",
    // newUser: "/auth/sign-up",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;

        // If using Google, store the access token
        if (account?.provider === "google") {
          token.accessToken = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      // Add error to session if present
      if (token.error) {
        session.error = String(token.error);
      }

      return session;
    },
    async signIn({ account, profile }) {
      // For Google sign-in, ensure the email is verified
      if (account?.provider === "google" && profile?.email) {
        try {
          // Check if user exists
          const existingUser = await db.query.usersTable.findFirst({
            where: eq(usersTable.email, profile.email),
          });

          // console.log("googel exits :: ", existingUser);

          // If not, create a new user (worsks for both signin and signup)
          if (!existingUser && profile.email) {
            await db.insert(usersTable).values({
              name: profile.name!,
              email: profile.email,
              passwordHash: "", // No password for OAuth users
              provider: "google",
            });
          }

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }

      return true;
    },
  },
  trustHost: true, // Required for production environments
  // logger: {
  //   error(code, ...message) {
  //     log.error(code, message);
  //   },
  //   warn(code, ...message) {
  //     log.warn(code, message);
  //   },
  //   debug(code, ...message) {
  //     log.debug(code, message);
  //   },
  // },
});
