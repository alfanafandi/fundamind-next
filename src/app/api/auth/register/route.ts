import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    // Attempt registration
    const registerResult = await registerUser(username, password);

    if (!registerResult.success) {
      return NextResponse.json(
        { success: false, error: registerResult.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: registerResult.message,
    });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
