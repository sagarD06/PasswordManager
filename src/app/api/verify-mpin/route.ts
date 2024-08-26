import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import bcrypt from "bcrypt";

/*****************************VERIFY MPIN ROUTE********************************************/
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { mpin } = await request.json();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!session || !user) {
      return Response.json({
        success: false,
        message: "Please login to perform this action",
      });
    }

    const currentUser = await UserModel.findById({ _id: user._id });

    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "User not found in database",
        },
        { status: 404 }
      );
    }
    const isMpinCorrect = await bcrypt.compare(
      mpin as string,
      currentUser?.mPin
    );
    if (!isMpinCorrect) {
      let attempts = currentUser?.mPinAttempts;
      if (attempts > 0) {
        attempts -= 1;
        currentUser.mPinAttempts = attempts;
        await currentUser.save();
      } else {
        return Response.json(
          {
            success: false,
            message:
              "You have exceeded the maximum number of attempts. Please create a new M-Pin",
          },
          { status: 419 }
        );
      }
      return Response.json(
        {
          success: false,
          message: "Incorrect mPin provided.",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Mpin verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong while verifying mpin",
        error: error,
      },
      { status: 500 }
    );
  }
}
