/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { es } from "date-fns/locale";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";

interface Props {
  obtainDate: (selectedDate: string) => void;
}

function CalendarReservation({ obtainDate }: Props) {
  const [selected, setSelected] = useState<Date>();
  const defaultClassNames = getDefaultClassNames();

  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11);

  useEffect(() => {
    if (selected) {
      const DateFormat = format(selected, "d 'de' MMMM yyyy", { locale: es });
      obtainDate("Seleccionaste " + DateFormat);
    }
  }, [selected]);

  return (
    <DayPicker
      locale={es}
      classNames={{
        today: `border-amber-500`, // Add a border to today's date
        selected: `bg-black border-amber-500 text-white rounded-lg `, // Highlight the selected day
        root: `${defaultClassNames.root} shadow-lg p-4 rounded-xl border border-bold `, // Add a shadow to the root element
        chevron: `fill-black-500 `, // Change the color of the chevron
        caption_label: `flex items-center capitalize text-2xl font-normal  `, // Style for the caption label
        day: "text-[#0FF48D] ",
        disabled: `!text-black opacity-20 !cursor-load `, // Style for disabled days
      }}
      navLayout="around" //cambia la seleccion del mes a un slider chevre
      animate
      mode="single"
      selected={selected}
      onSelect={setSelected}
      startMonth={today} // empieza desde el mes actual
      endMonth={endOfYear} // termina en diciembre del año actual
      disabled={[
        new Date(2025, 11, 11), //dia 11 para mostrar no disponible de reserva full
        { before: new Date() }, // deshabilita los dias anteriores a hoy
        { dayOfWeek: [0, 6] }, // deshabilita los fines de semana (0 es domingo, 6 es sábado)
      ]} // es clave para desactivar cuando este full una reserva se transformara en un array posteriormente
      modifiers={{ booked: new Date(2025, 11, 11) }} // selecciona el ano - fecha - dia a modificar
      modifiersClassNames={{
        // estilos para dias modificados
        booked: "opacity-100 !bg-[#FF600B] text-white rounded-lg",
      }}
      showOutsideDays
      required
    />
  );
}

export default CalendarReservation;
