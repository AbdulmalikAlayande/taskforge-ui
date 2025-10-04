// app/api/auth/success/route.ts
import { NextResponse } from "next/server";
import { auth } from "@src/lib/auth";

/**
 * This route handles the OAuth callback redirect
 * After successful OAuth, NextAuth redirects here
 * We can access the session which now contains YOUR backend tokens
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.backendToken) {
      // OAuth failed or backend didn't provide tokens
      return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
    }

    // Get the auth intent from session storage (signup vs login)
    // Note: You might need to pass this via query params instead
    const { searchParams } = new URL(request.url);
    const intent = searchParams.get("intent") || "login";

    // Store tokens in cookies if needed (optional, session already has them)
    const response = NextResponse.redirect(
      new URL(intent === "signup" ? "/onboarding" : "/dashboard", request.url)
    );

    // Optionally set cookies for easier access (though session already has tokens)
    response.cookies.set("backend_token", session.backendToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 3, // 3 days
    });

    if (session.refreshToken) {
      response.cookies.set("refresh_token", session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    console.error("Success route error:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", request.url));
  }
}