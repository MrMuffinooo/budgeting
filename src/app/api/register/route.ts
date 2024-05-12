import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_COGNITO_REGION,
});

export async function POST(request: Request) {
  const req = await request.json();
  console.log("Registering", req);
  const input = {
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    Username: req.username,
    Password: req.password,
  };
  console.log("cognito:");
  try {
    const response = await cognitoClient.send(new SignUpCommand(input));
    console.log(response);
    return NextResponse.json(
      { message: "Registered", error: false, data: response },
      { status: 200 }
    );
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
