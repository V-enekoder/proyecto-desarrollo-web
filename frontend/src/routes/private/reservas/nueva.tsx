import ReservationForm from "@/components/reservas/reservation-form";
import { AvailableHours } from "@/components/reservas/reservation-form/schema";
import type { Route } from "./+types/nueva";
import { useEffect } from "react";
import { getAccessToken } from "@/lib/auth";
import { useState } from "react";

export async function clientLoader() {
  return {
    availableHours: AvailableHours,
  };
}

export default function NuevaReserva({ loaderData }: Route.ComponentProps) {
  const [laboratorys, setLaboratorys] = useState([]);
  const [stateEventType, setEventType] = useState([]);
  const [reserved, sethoursReserved] = useState([]);

  const fetchData = async (route: string, token: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOSTNAME_BACKEND}/${route}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();

      return data;
    } catch (error) {
      console.error("Error al obtener laboratorios:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initReservation = async () => {
      try {
        const token = await getAccessToken();
        const [resLabs, resTypes, resReserved] = await Promise.all([
          fetchData("api/laboratories", token as string).catch((e) => ({
            error: "labs",
            msg: e,
          })),
          fetchData("api/reserve-types", token as string).catch((e) => ({
            error: "types",
            msg: e,
          })),
          fetchData("api/reservations", token as string).catch((e) => ({
            error: "resv",
            msg: e,
          })),
        ]);

        if (resLabs.error || resTypes.error || resReserved.error) {
          console.error("¡Una petición falló!", {
            resLabs,
            resTypes,
            resReserved,
          });
          return;
        }

        setLaboratorys(resLabs);
        setEventType(resTypes);
        sethoursReserved(
          resReserved.map((reser: any) => ({
            startDate: reser.startDate,
            defaultStartTime: reser.defaultStartTime,
          })),
        );
      } catch (err) {
        console.error("Error crítico en initReservation:", err);
        throw err;
      }
    };

    initReservation();
  }, []);

  return (
    <ReservationForm
      availableHours={loaderData.availableHours}
      availableLaboratory={laboratorys}
      stateTypeEvent={stateEventType}
      reserved={reserved}
    />
  );
}
