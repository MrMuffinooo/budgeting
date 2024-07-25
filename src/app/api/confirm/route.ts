import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

export async function handler(request: Request) {
  const req = await request.json();
  console.log("Confirming", req);
  const input = {
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    Username: req.username,
    ConfirmationCode: req.code,
  };
  console.log("cognito:");
  try {
    const response = await cognitoClient.send(new ConfirmSignUpCommand(input));
    console.log(response);
    return NextResponse.json(
      { message: "Confirmed", error: false, data: response },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof CognitoIdentityProviderServiceException) {
      return NextResponse.json(
        { message: e.message, error: true, data: e },
        { status: e.$response?.statusCode ?? 500 }
      );
    } else {
      return NextResponse.json(
        { message: e, error: true, data: e },
        { status: 500 }
      );
    }
  }
}
