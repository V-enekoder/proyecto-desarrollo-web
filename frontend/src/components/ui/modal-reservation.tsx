import { useState, type ChangeEventHandler } from "react";
import CalendarReservation from "./calendar-reservation";

function ModalReservasion() {
  const [date, setDate] = useState<string>("Selecciona un dia");
  const AvailableHours = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const obtainDate = (selectedDate: string): void => {
    setDate(selectedDate);
  };

  //Se usara par verificar la hora que seaa un entero
  const verificationHours = (hour: string) => {
    const isValid = AvailableHours.includes(hour);

    if (isValid) return true;

    alert("Hora no válida, por favor seleccione las horas que se te indican");
    return false;
  };

  return (
    <div className="fixed z-50 flex w-full justify-center overflow-x-hidden overflow-y-auto shadow-black sm:px-4 md:px-0">
      <div className="shadow-4xl h-[750px] w-full overflow-y-auto rounded-lg border border-solid border-gray-300 p-4 shadow-xl md:h-full md:w-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-14">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-[#0FF48D]"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-[#FF600B]"></div>
                <span>No Disponible</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center">
                <h2 className="text-center text-3xl font-semibold">
                  Calendario de Reservas
                </h2>
                <p className="w-3/4 text-center text-xl font-light">
                  Selecciona un dia para ver la disponibilidad
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <CalendarReservation obtainDate={obtainDate} />
                <p className="w-3/4 px-2 text-center font-bold text-[#A91515]">
                  <span>Nota:</span> Las reservas duran 2 horas para dar clases
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-rows-[auto-1fr-auto] gap-4">
            <div className="k h-28 w-96 justify-self-center-safe rounded-lg bg-[#F5F6F6] py-2 text-center shadow-xl">
              <h2 className="text-xl font-semibold">{date}</h2>
              <p className="my-2 text-[#A91515]">
                Horas de Reservas no disponibles
              </p>
              <span className="text-[#A91515]"> 9am - 11 am - 1pm</span>
            </div>

            <div className="flex-col space-y-10">
              <div className="space-y-2">
                <p>
                  <label className="font-normal">
                    Selecciona la hora a reservar
                  </label>
                </p>
                <input
                  id="time"
                  className="h-12 w-full rounded border border-gray-300 p-2" // Tus clases de Tailwind
                  list="horas-disponibles"
                  type="time"
                />
                <datalist id="horas-disponibles">
                  {AvailableHours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <p>
                  <label
                    htmlFor="message"
                    className="heading font-normal-m block"
                  >
                    Escribe una descripcion del motivo de reserva
                  </label>
                </p>
                <textarea
                  id="message"
                  className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand placeholder:text-body block h-36 w-full resize-none rounded-lg border p-3.5 text-sm shadow-xs"
                  placeholder="Escribe por que necesitas reservar este espacio"
                ></textarea>
              </div>
            </div>

            <div className="order-1 my-2 flex h-9 justify-center gap-12 self-end text-white">
              <button
                type="button"
                className="w-28 rounded-sm bg-[#941719] hover:bg-red-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="w-28 rounded-sm bg-[#12643F] hover:bg-green-700"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalReservasion;
