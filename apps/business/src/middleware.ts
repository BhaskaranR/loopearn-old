import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/protected")) {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}
