import { getAccessToken } from "@/lib/auth";

async function postReservation(value: any) {
  const token = await getAccessToken();
  try {
    const res = await fetch("http://localhost:3000/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(value),
    });

    alert("Reservación creada con éxito");

    return res;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    alert("Error al crear la reservación");
    throw new Error("Error al crear la reservación");
  }
}

export default postReservation;
