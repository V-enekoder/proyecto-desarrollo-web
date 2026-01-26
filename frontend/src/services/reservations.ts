import { apiClient } from "@/lib/api";
import { PaginationSchema } from "@uneg-lab/api-types/pagination";
import { ReservationSchema } from "@uneg-lab/api-types/reservation";

const ReservationPaginated = PaginationSchema(ReservationSchema);

export const reservationsService = {
  search: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));

    return apiClient
      .get("reservations", { searchParams })
      .json()
      .then(ReservationPaginated.parse);
  },

  getById: async (id: number) => {
    return apiClient
      .get(`reservations/${id}`)
      .json()
      .then(ReservationSchema.parse);
  },
};
