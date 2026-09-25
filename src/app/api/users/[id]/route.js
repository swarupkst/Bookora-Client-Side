import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const allowedRoles = ["user", "librarian", "admin"];

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid user ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          message: "Invalid role",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("bookora");

    const result = await db.collection("user").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          role: role,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const updatedUser = await db.collection("user").findOne(
      {
        _id: new ObjectId(id),
      },
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
    );

    return NextResponse.json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Role Error:", error);

    return NextResponse.json(
      {
        message: "Failed to update user role",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid user ID",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("bookora");

    const result = await db.collection("user").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}