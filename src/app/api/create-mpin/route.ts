import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcrypt";

/*****************************CREATE MPIN ROUTE********************************************/
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, mpin } = await request.json();

    const currentUser = await UserModel.findOne({ username });

    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "User not found in database",
        },
        { status: 404 }
      );
    }

    const hashedMpin = await bcrypt.hash(mpin, 10);
    let mPinValidity = new Date();
    mPinValidity.setMonth(mPinValidity.getMonth() + 1);

    currentUser.mPin = hashedMpin;
    currentUser.mPinExpiry = mPinValidity;
    await currentUser.save();

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
