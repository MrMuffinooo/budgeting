import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("logging in");
  return NextResponse.json({ message: "Logged in" }, { status: 200 });
}
