import { DefaultSession } from "next-auth";

// Extending these interfaces ensures that TypeScript will provide accurate type checking and IntelliSense support when accessing the id (and potentially role) properties on the session.user object.
// Declare a module augmentation for "next-auth"
declare module "next-auth" {
  /**
   * Extends the built-in Session interface.
   * This allows adding custom properties to the session object.
   */
  interface Session {
    user: {
      id: string;
      // name?: string | null;
      // email?: string | null;
      role?: string;
    } & DefaultSession["user"];
    error?: string; // Explicitly define error as string or undefined
  }

  interface JWT {
    id?: string;
    name?: string | null;
    accessToken?: string;
    error?: string; // Ensure JWT token error is also typed as string
  }

  // Optionally, you can also extend the User interface to include additional properties.
  interface User {
    role?: string;
  }
}
