import { adminZodSchema } from "../user/user.validation";


const updateAdmin = adminZodSchema.partial();

export const AdminValidation = {
  updateAdmin,
};
