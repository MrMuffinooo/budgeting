import { NextResponse } from "next/server";
import { connectDbClient } from "@/utils/getDbClient";
import { AuthenticatedUser } from "@/utils/authenticatedUser";

export async function GET(request: Request) {
  console.log("getting user data...");

  const userId = await AuthenticatedUser();

  if (userId) {
    const dbClient = await connectDbClient();
    const db = dbClient.db("BudgetMe").collection("Users");
    const res = await db.findOne({ userId: userId });
    dbClient.close();
    return NextResponse.json(res);
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
