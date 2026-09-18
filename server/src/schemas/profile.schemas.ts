import { z } from 'zod';

export const updateNotificationPreferenceSchema = z.object({
  enabled: z.boolean(),
});
