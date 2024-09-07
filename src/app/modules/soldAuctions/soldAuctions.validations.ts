import { z } from 'zod';


// Zod schema for ISoldAuction
const createSoldAuctionZodSchema = z.object({
  
});


const updateSoldAuctionZodSchema = createSoldAuctionZodSchema.partial();

export const SoldAuctionValidation = {
  createSoldAuctionZodSchema,
  updateSoldAuctionZodSchema,
};
