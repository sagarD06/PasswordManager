import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";

/*****************************DELETE APPS PASSWORD ROUTE********************************************/

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const passwordId = params.id;
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Please login to perform this action",
        },
        { status: 401 }
      );
    }

    const updatedUser = await UserModel.updateOne(
      { _id: user?._id },
      { $pull: { passwords: { _id: passwordId } } }
    );
    if (updatedUser.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Apps password not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Apps password deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong while deleting password.",
      },
      { status: 500 }
    );
  }
}
