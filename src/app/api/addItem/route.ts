import { NextResponse } from "next/server";
import { connectDbClient } from "@/utils/getDbClient";
import { AuthenticatedUser } from "@/utils/authenticatedUser";

export async function POST(request: Request) {
  console.log("adding expence...");

  const req = await request.json();
  console.log(req);

  const userId = await AuthenticatedUser();

  if (userId) {
    const dbClient = await connectDbClient();
    const db = dbClient.db("BudgetMe").collection("Expences");
    const res = await db.insertOne({
      userId: userId,
      category: req.category,
      date: req.date,
      amount: req.amount,
      note: req.note,
    });
    dbClient.close();
    return NextResponse.json(res);
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
