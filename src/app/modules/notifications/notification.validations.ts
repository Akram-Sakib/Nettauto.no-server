import { z } from 'zod';
// Zod schema for IDocuments

// Zod schema for INotification
const createNotificationZodSchema = z.object({
});


const updateNotificationZodSchema = createNotificationZodSchema.partial();

export const NotificationValidation = {
  createNotificationZodSchema,
  updateNotificationZodSchema,
};
