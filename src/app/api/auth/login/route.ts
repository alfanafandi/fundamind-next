import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { setSessionCookie } from "@/lib/jwt";
import { loginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    // Attempt login
    const loginResult = await loginUser(username, password);

    if (!loginResult.success) {
      return NextResponse.json(
        { success: false, error: loginResult.error },
        { status: 401 }
      );
    }

    // Set session cookie
    if (loginResult.token) {
      await setSessionCookie(loginResult.token);
    }

    return NextResponse.json({
      success: true,
      user: loginResult.user,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
