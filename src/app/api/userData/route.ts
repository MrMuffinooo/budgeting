import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { isAccessTokenValid } from "@/utils/isAccessTokenValid";
import { NextResponse } from "next/server";
import { connectDbClient } from "@/utils/getDbClient";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_COGNITO_REGION,
  });

  console.log("getting user data...");

  const cookieStore = cookies();
  const accessToken = cookieStore.get("AccessToken")?.value;

  if (accessToken) {
    const user = await isAccessTokenValid(cognitoClient, accessToken);
    if (user) {
      const dbClient = await connectDbClient();
      const db = dbClient.db("BudgetMe").collection("Users");
      const res = await db.findOne({ userId: user });
      dbClient.close();
      return NextResponse.json(res);
    }
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
