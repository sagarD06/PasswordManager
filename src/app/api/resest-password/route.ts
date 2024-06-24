import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcrypt";

/*****************************RESET PASSOWRD ROUTE********************************************/

export async function PATCH(request: Request) {
  try {
    await dbConnect();

    const { username, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await UserModel.findOneAndUpdate(
      { username: username },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User does not exist!",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User has been updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong while updating password",
      },
      { status: 500 }
    );
  }
}
