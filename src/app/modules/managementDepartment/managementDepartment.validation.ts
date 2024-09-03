import { z } from 'zod';

const createManagementCarZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

const updateManagementCarZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

export const ManagementCarValidation = {
  createManagementCarZodSchema,
  updateManagementCarZodSchema,
};
