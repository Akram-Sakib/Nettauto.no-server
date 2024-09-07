import { z } from 'zod';
// Zod schema for IDocuments
const DocumentSchema = z.object({
  originalname: z.string().nonempty("Title is required"),
  path: z.string().nonempty("PDF link is required"),
});

// Zod schema for IBid
const createBidZodSchema = z.object({
 
});


const updateBidZodSchema = createBidZodSchema.partial();

export const BidValidation = {
  createBidZodSchema,
  updateBidZodSchema,
};
