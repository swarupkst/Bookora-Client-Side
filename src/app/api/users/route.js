import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("bookora");

    const users = await db
      .collection("user")
      .find(
        {},
        {
          projection: {
            name: 1,
            email: 1,
            image: 1,
            role: 1,
            emailVerified: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        }
      )
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Users API Error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}