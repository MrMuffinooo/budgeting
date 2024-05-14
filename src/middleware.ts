import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_COGNITO_REGION,
});

async function isAccessTokenValid(token: string) {
  const input = {
    AccessToken: token,
  };
  try {
    const response = await cognitoClient.send(new GetUserCommand(input));
    return response.Username ? true : false;
  } catch (e) {
    return false;
  }
}

async function authRefreshToken(token: string) {
  const input: InitiateAuthCommandInput = {
    ClientId: process.env.AWS_COGNITO_CLIENT_ID ?? "ERROR",
    AuthFlow: "REFRESH_TOKEN",
    AuthParameters: {
      REFRESH_TOKEN: token,
    },
  };
  const response = await cognitoClient.send(new InitiateAuthCommand(input));
  if (
    response.AuthenticationResult?.AccessToken &&
    response.AuthenticationResult?.ExpiresIn
  ) {
    return {
      accToken: response.AuthenticationResult.AccessToken,
      expiresIn: response.AuthenticationResult.ExpiresIn,
    };
  } else {
    throw new Error("Authentication with refresh token failed");
  }
}

function authenticatedRedirect(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

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

  const cookieStore = cookies();
  const accessToken = cookieStore.get("AccessToken")?.value;
  const refreshToken = cookieStore.get("RefreshToken")?.value;

  if (!accessToken && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (accessToken && (await isAccessTokenValid(accessToken))) {
    return authenticatedRedirect(request);
  }
  console.log("access token failed");
  if (refreshToken) {
    console.log("refresh token found");
    try {
      const auth = await authRefreshToken(refreshToken);

      console.log("here");
      const res = authenticatedRedirect(request);
      res.cookies.set("AccessToken", auth.accToken, {
        expires: Date.now() + (auth.expiresIn ?? 600) * 1000, //10 min min
        sameSite: "strict",
      });
      return res;
    } catch (e) {
      console.log(e);
      console.log("refresh token failed");
    }
  }
  console.log("refresh token not found");
  const res = request.nextUrl.pathname.startsWith("/login")
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/login", request.url));
  res.cookies.delete("AccessToken");
  res.cookies.delete("RefreshToken");
  return res;
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
