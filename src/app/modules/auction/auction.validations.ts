import { z } from 'zod';
import { AUCTION_STATUS } from './auction.constants';
// Zod schema for IDocuments

const documentSchema = z.object({
  originalname: z.string(),
  path: z.string(),
});

const createAuctionZodSchema = z.object({
  carDetails: z.object({
    carRegistrationNo: z.string().min(1, 'Car registration number is required'),
    place: z.string().min(1, 'Place is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    yearModel: z.string().min(1, 'Year model is required'),
    kilometer: z.string().min(1, 'Kilometer is required'),
    cylinderVolume: z.string().min(1, 'Cylinder volume is required'),
    effect: z.string().min(1, 'Effect is required'),
    color: z.string().min(1, 'Color is required'),
    gearType: z.string().min(1, 'Gear type is required'),
    operatingType: z.string().min(1, 'Operating type is required'),
    fuel: z.string().min(1, 'Fuel type is required'),
    descriptionCondition: z.string().min(10, 'Condition description must be at least 10 characters'),
    equipment: z.array(z.string()).optional(),
    documents: z.array(documentSchema).optional(),
  }),
  auctionDetails: z.object({
    minimumPrice: z.number().min(1, 'Minimum price is required'),
    startTime: z.coerce.date({
      required_error: "Start Time is required"
    }),
    endTime: z.coerce.date({
      required_error: "End Time is required"
    }),
  }),
});

const updateAuctionZodSchema = createAuctionZodSchema.partial();

export const AuctionValidation = {
  createAuctionZodSchema,
  updateAuctionZodSchema,
};
