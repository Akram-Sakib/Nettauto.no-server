import { z } from 'zod';
// Zod schema for IDocuments
const DocumentSchema = z.object({
  originalname: z.string().nonempty("Title is required"),
  path: z.string().nonempty("PDF link is required"),
});

// Zod schema for ISoldAuction
const createSoldAuctionZodSchema = z.object({
  carRegistrationNo: z.string().nonempty("SoldAuction registration number is required"),
  place: z.string().nonempty("Place is required"),
  description: z.string().nonempty("Description is required"),
  images: z.array(z.string().url().nonempty("Image URL is required")),
  brand: z.string().nonempty("Brand is required"),
  model: z.string().nonempty("Model is required"),
  yearModel: z.string().nonempty("Year model is required"),
  kilometer: z.string().nonempty("Kilometer is required"),
  cylinderVolume: z.string().nonempty("Cylinder volume is required"),
  effect: z.string().nonempty("Effect is required"),
  color: z.string().nonempty("Color is required"),
  gearType: z.string().nonempty("Gear type is required"),
  operatingType: z.string().nonempty("Operating type is required"),
  minimumPrice: z.string().nonempty("Minimum price is required"),
  fuel: z.string().nonempty("Fuel type is required"),
  descriptionCondition: z.string().nonempty("Condition description is required"),
  equipment: z.array(z.string().nonempty("Equipment is required")),
  documents: z.array(DocumentSchema),
  soldAuctionTime: z.string().nonempty("SoldAuction time is required")
});


const updateSoldAuctionZodSchema = createSoldAuctionZodSchema.partial();

export const SoldAuctionValidation = {
  createSoldAuctionZodSchema,
  updateSoldAuctionZodSchema,
};
