import { apiClient } from "@/lib/api";
import { ReservationSchema } from "@uneg-lab/api-types/reservation";

export const reservationsService = {
  getAll: async () => {
    return apiClient
      .get("reservations")
      .json()
      .then(ReservationSchema.array().parse);
  },

  getById: async (id: number) => {
    return apiClient
      .get(`reservations/${id}`)
      .json()
      .then(ReservationSchema.parse);
  },
};
