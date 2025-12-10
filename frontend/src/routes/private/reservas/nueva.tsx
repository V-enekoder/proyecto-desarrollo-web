import ReservationForm from "@/components/reservas/reservation-form";
import { AvailableHours } from "@/components/reservas/reservation-form/schema";
import type { Route } from "./+types/nueva";

export async function clientLoader() {
  return {
    availableHours: AvailableHours,
  };
}

export default function NuevaReserva({ loaderData }: Route.ComponentProps) {
  return <ReservationForm availableHours={loaderData.availableHours} />;
}
