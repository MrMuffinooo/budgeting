import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { isAccessTokenValid } from "@/utils/isAccessTokenValid";
import { NextResponse } from "next/server";
import { connectDbClient } from "@/utils/getDbClient";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_COGNITO_REGION,
  });

  console.log("adding expence...");

  const req = await request.json();
  console.log(req);

  const cookieStore = cookies();
  const accessToken = cookieStore.get("AccessToken")?.value;

  if (accessToken) {
    const user = await isAccessTokenValid(cognitoClient, accessToken);
    if (user) {
      const dbClient = await connectDbClient();
      const db = dbClient.db("BudgetMe").collection("Expences");
      const res = await db.insertOne({
        userId: user,
        category: req.category,
        date: req.date,
        amount: req.amount,
        note: req.note,
      });
      dbClient.close();
      return NextResponse.json(res);
    }
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
