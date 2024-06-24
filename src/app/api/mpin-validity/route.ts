import UserModel from "@/models/User.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

/*****************************CHECK VALID MPIN ROUTE********************************************/

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = (session?.user as User) || null;

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Please login",
        },
        { status: 401 }
      );
    }
    const currentUser = await UserModel.findById({ _id: user?._id });

    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "User not found in database",
        },
        { status: 404 }
      );
    }

    const isMpinValid = new Date(currentUser.mPinExpiry) > new Date();

    if (!isMpinValid) {
      return Response.json({
        success: false,
        message: "Your M-Pin has expired. Please create a new one.",
      });
    }

    return Response.json(
      {
        success: true,
        message: "Valid Mpin",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "something went wrong while verifying Mpin",
      },
      { status: 500 }
    );
  }
}
