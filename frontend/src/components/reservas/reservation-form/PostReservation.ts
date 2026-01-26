import { apiClient } from "@/lib/api";

async function postReservation(value: any) {
  try {
    const res = await apiClient.post("reservations", { json: value });

    return res;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    alert("Error al crear la reservación");
    throw new Error("Error al crear la reservación");
  }
}

export default postReservation;
