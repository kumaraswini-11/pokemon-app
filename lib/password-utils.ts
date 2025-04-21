import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== "undefined") {
    throw new Error("Password hashing can only be performed on the server");
  }

  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    throw new Error("Password verification can only be performed on the server");
  }

  if (!hash) {
    return false;
  }

  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}
