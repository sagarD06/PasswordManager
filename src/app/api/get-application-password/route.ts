import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";

/*****************************GET APPS PASSWORDS ROUTE********************************************/

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session && !_user) {
    return Response.json(
      { success: false, message: "User not authenticated!" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$passwords" },
      { $sort: { "passwords.createdAt": -1 } },
      { $group: { _id: "$_id", passwords: { $push: "$passwords" } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: user[0].passwords }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch messages!" },
      { status: 500 }
    );
  }
}
