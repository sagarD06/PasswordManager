import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcrypt";

/*****************************SIGNUP ROUTE********************************************/

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 401 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "This email is already registered" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        let verifyTokenExpiry = new Date();
        verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);

        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyToken = verifyToken;
        existingUserByEmail.verifyTokenExpiry = verifyTokenExpiry;

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      let verifyTokenExpiry = new Date();
      verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpiry,
        isVerified: false,
        mPin: "12345",
        mPinExpiry: new Date(),
        mPinAttempts: 3,
        passwords: [],
      });
      await newUser.save();
    }

    /* Send verification email */
    const emailResponse = await sendVerificationEmail(
      email,
      verifyToken,
      username
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: "Error sending email" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "User created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while siging up the user", error);
    return Response.json(
      { success: false, message: "Error signing up the user" },
      { status: 500 }
    );
  }
}
