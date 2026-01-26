import { z } from "zod";

export const ReservationSchema = z.object({
  id: z.number(),
  name: z.string(),
  startDate: z.string(),
  state: z.object(),
});

export type Reservation = z.infer<typeof ReservationSchema>;
