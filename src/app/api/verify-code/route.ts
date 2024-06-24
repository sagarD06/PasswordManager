import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

/*****************************VERIFY ROUTE********************************************/

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User does not exist!" },
        { status: 404 }
      );
    }
    const isTokenCorrect = user.verifyToken === code;
    const isTokenValid = new Date(user.verifyTokenExpiry) > new Date();

    if (isTokenCorrect && isTokenValid) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Code verified successfully!" },
        { status: 201 }
      );
    } else if (!isTokenValid) {
      return Response.json(
        {
          success: false,
          message: "Your verification code has expired, please sign up again!",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Verification code entered is incorrect!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to verfiy code!");
    return Response.json(
      { success: false, message: "Failed to verify code!" },
      { status: 500 }
    );
  }
}
