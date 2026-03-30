import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  const { userId } = getAuth(req);
  
  // Get current server time in ISO and Unix formats
  const serverTime = new Date();
  
  return NextResponse.json({
    success: true,
    message: "Server is healthy",
    // This helps debug Clerk "Clock Skew"
    debug: {
      userId: userId || "null", // Check if Clerk recognizes you
      serverTimeISO: serverTime.toISOString(),
      serverTimeUnix: Math.floor(serverTime.getTime() / 1000),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  });
}