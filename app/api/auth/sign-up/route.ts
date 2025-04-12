import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { hashPassword } from "@/lib/password-utils";
import { signUpFormSchema } from "@/schemas";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, email, password, provider } = signUpFormSchema.parse(reqBody);

    // Check if user already exists
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password and insert in to db
    const hashedPassword = await hashPassword(password);
    await db.insert(usersTable).values({
      name,
      email,
      passwordHash: hashedPassword,
      provider,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    // console.error("Sign-up API error:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
