import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export async function middleware(request: NextRequest) {
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
        cookieStore.delete("AccessToken");
        throw new Error("invalid access token");
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
