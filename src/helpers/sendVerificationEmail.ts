import verificationEmail from "../../emails/verificationEmail";
import { Resend } from "resend";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  verificationCode: string,
  username: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Manager Verification",
      react: verificationEmail({ username, otp: verificationCode }),
    });
    return { success: true, message: "Verification Code sent successfully!" };
  } catch (error) {
    console.error("Failed to send verification code!", error);
    return { success: false, message: "Failed to send Verification Code" };
  }
}
