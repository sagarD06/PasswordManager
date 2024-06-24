import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";

/*******************************UPDATE APPS PASSWORD ROUTE****************************************/

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const passwordId = params.id;
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = (session?.user as User) || null;

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Please login to perform this action",
        },
        { status: 401 }
      );
    }

    const { password } = await request.json();

    const updatedUser = await UserModel.updateOne(
      { username: user.username, passwords: { _id: passwordId } },
      { $set: { "passwords.$.password": password } },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User dont exist!",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong while updating the password",
      },
      { status: 500 }
    );
  }
}
