import * as argon2 from "argon2";

// Argon2 recommended parameters (from OWASP)
const HASH_OPTIONS = {
  type: argon2.argon2id, // Hybrid of Argon2i and Argon2d; provides resistance against both side-channel and GPU attacks.
  memoryCost: 65536, // 64 MiB; increases memory usage to hinder large-scale attacks.
  timeCost: 3, // Number of iterations; increases computation time to slow down brute-force attacks.
  parallelism: 4, // Number of parallel threads; should match the number of CPU cores for optimal performance.
  hashLength: 32, // Length of the generated hash in bytes; 32 bytes (256 bits) is a common choice.
  saltLength: 16, // Length of the random salt in bytes; 16 bytes is standard to prevent rainbow table attacks.
};

/**
 * Hash a password using Argon2id
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, HASH_OPTIONS);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hash - Stored password hash
 * @returns Whether the password matches the hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    console.error("Password verification error:", error);
    throw new Error("Failed to verify password");
  }
}
