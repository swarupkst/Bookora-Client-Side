import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("bookora");

    const librarians = await db
      .collection("user")
      .find(
        { role: "librarian" },
        {
          projection: {
            name: 1,
            email: 1,
            image: 1,
            role: 1,
          },
        }
      )
      .toArray();

    return NextResponse.json(librarians);
  } catch (error) {
    console.error("Librarian API Error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch librarians",
      },
      {
        status: 500,
      }
    );
  }
}