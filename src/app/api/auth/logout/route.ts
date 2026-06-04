import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(`${origin}/`, { status: 302 });

  // Clear all possible NextAuth cookie names (dev vs production differ)
  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token", // used in production (HTTPS)
    "next-auth.csrf-token",
    "__Secure-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
    "__Host-next-auth.csrf-token",
  ];

  cookieNames.forEach((name) => {
    response.cookies.set(name, "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  });

  return response;
}
