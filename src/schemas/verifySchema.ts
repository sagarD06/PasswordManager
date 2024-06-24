import { z } from "zod";

export const verifyTokenSchema = z.object({
  code: z.string().length(6, { message: "Token must be 6 characters" }),
});
