import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next") || // exclude Next.js internals
    request.nextUrl.pathname.startsWith("/api") || //  exclude all API routes
    request.nextUrl.pathname.startsWith("/static") || // exclude static files
    /\.(.*)$/.test(request.nextUrl.pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }
  console.log(request.nextUrl.pathname);
  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_COGNITO_REGION,
  });

  const cookieStore = cookies();

  if (cookieStore.has("AccessToken")) {
    const input = {
      AccessToken: cookieStore.get("AccessToken")?.value,
    };
    try {
      const response = await cognitoClient.send(new GetUserCommand(input));
      if (response.Username) {
        if (request.nextUrl.pathname.startsWith("/login")) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
      } else {
        throw new Error("invalid access token");
      }
    } catch (e) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("AccessToken");
      return res;
    }
  }
  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
