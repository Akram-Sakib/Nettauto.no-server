import { z } from 'zod';
import { activeAs } from './businessCustomer.constant';

const updateBusinessCustomerZodSchema = z.object({
  body: z.object({
    email: z.string().optional(),
    contactPerson: z.string().optional(),
    companyName: z.string().optional(),
    organizationNo: z.string().optional(),
    dateOfBirth: z.string().optional(),
    contactNo: z.string().optional(),
    emailForNotifications: z.string().optional(),
    postalNo: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    acceptTerms: z.boolean().optional(),
    auctionsEmail: z.boolean().optional(),
    bidEmail: z.boolean().optional(),
    isSeller: z.boolean().optional(),
    isBuyer: z.boolean().optional(),
    activeAs: z.enum([...activeAs] as [string, ...string[]]).optional(),
    profileImage: z.string().optional(),
  }),
});

export const BusinessCustomerValidaion = {
  updateBusinessCustomerZodSchema,
};
