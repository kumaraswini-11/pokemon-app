// Verify a password against a hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Make sure we're on the server
  if (typeof window !== "undefined") {
    throw new Error("Password verification can only be performed on the server");
  }

  // Handle empty hash case (like for OAuth users)
  if (!hash) {
    return false;
  }

  try {
    // Dynamic import for argon2 (only on server)
    const argon2 = await import("argon2");
    return await argon2.verify(hash, password);
  } catch (error) {
    console.error("Password verification error:", error);
    // Return false instead of throwing to handle gracefully in auth flow
    return false;
  }
}

// Hash a password using Argon2id
export async function hashPassword(password: string): Promise<string> {
  // Make sure we're on the server
  if (typeof window !== "undefined") {
    throw new Error("Password hashing can only be performed on the server");
  }

  try {
    // Dynamic import for argon2 (only on server)
    const argon2 = await import("argon2");

    return await argon2.hash(password, {
      type: argon2.argon2id, // Hybrid of Argon2i and Argon2d; provides resistance against both side-channel and GPU attacks.
      memoryCost: 65536, // 64 MiB; increases memory usage to hinder large-scale attacks.
      timeCost: 3, // Number of iterations; increases computation time to slow down brute-force attacks.
      parallelism: 4, // Number of parallel threads; should match the number of CPU cores for optimal performance.
      hashLength: 32, // Length of the generated hash in bytes; 32 bytes (256 bits) is a common choice.
      // saltLength: 16, // Length of the random salt in bytes; 16 bytes is standard to prevent rainbow table attacks.
    });
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}
