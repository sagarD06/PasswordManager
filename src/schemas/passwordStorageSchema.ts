import { z } from "zod";

export const passwordStorageSchema = z.object({
  applicationName: z.string(),
  applicationPassword: z
    .string()
    .min(8, { message: "Please enter password with minimum 8 characters." }),
});
