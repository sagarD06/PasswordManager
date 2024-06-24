import { z } from "zod";

export const mPinSchema = z.object({
  mPin: z.string().length(6, "your pin must be of 6 digits"),
});
