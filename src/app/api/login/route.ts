import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_COGNITO_REGION,
});

export async function POST(request: Request) {
  const req = await request.json();

  const input: InitiateAuthCommandInput = {
    ClientId: process.env.AWS_COGNITO_CLIENT_ID ?? "ERROR",
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      PASSWORD: req.password,
      USERNAME: req.username,
    },
  };
  console.log("Logging in", req);
  console.log("cognito:");
  try {
    const response = await cognitoClient.send(new InitiateAuthCommand(input));
    console.log(response);
    if (
      response.AuthenticationResult?.AccessToken &&
      response.AuthenticationResult?.RefreshToken
    ) {
      cookies().set("AccessToken", response.AuthenticationResult.AccessToken, {
        expires:
          Date.now() + (response.AuthenticationResult.ExpiresIn ?? 600) * 1000, //10 min min
        sameSite: "strict",
      });
      cookies().set(
        "RefreshToken",
        response.AuthenticationResult.RefreshToken,
        {
          expires: Date.now() + 60 * 60 * 24 * 30 * 1000, // 1 month
          sameSite: "strict",
        }
      );

      return NextResponse.json(
        { message: "Logged in", error: false, data: response },
        { status: 200 }
      );
    } else {
      throw new Error("tokens not found");
    }
  } catch (e) {
    if (e instanceof CognitoIdentityProviderServiceException) {
      return NextResponse.json(
        { message: e.message, error: true },
        { status: e.$response?.statusCode ?? 500 }
      );
    } else {
      return NextResponse.json({ message: e, error: true }, { status: 500 });
    }
  }
}
