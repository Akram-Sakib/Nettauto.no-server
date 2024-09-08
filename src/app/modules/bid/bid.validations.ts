import { z } from 'zod';

// Zod schema for IBid
const createBidZodSchema = z.object({
 
});


const updateBidZodSchema = createBidZodSchema.partial();

export const BidValidation = {
  createBidZodSchema,
  updateBidZodSchema,
};
