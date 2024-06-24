import dbConnect from "@/lib/dbConnect";
import UserModel, { Password } from "@/models/User.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import bcrypt from "bcrypt";

/*****************************CREATE APPS PASSWORD ROUTE********************************************/

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { applicationName, applicationPassword } = await request.json();
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
    const hashedPassword = await bcrypt.hash(applicationPassword, 10);
    const newPassword = {
      applicationName,
      password: hashedPassword,
      createdAt: new Date(),
    };

    currentUser.passwords.push(newPassword as Password);
    await currentUser.save();

    return Response.json(
      {
        success: true,
        message: "Password saved successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong while saving password.",
      },
      { status: 500 }
    );
  }
}
