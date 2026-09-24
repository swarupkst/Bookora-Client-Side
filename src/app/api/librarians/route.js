import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DATABASE || "bookora"
    );

    const librarians = await db
      .collection("user")
      .find({
        role: "librarian",
      })
      .project({
        _id: 1,
        name: 1,
        image: 1,
        email: 1,
        phone: 1,
        role: 1,
      })
      .toArray();

    return NextResponse.json(librarians);
  } catch (error) {
    console.error("Failed to fetch librarians:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch librarians",
      },
      {
        status: 500,
      }
    );
  }
}