import { Reservation } from "../reservations/entities/reservation.entity.js";

const REPORT_TITLE = "Sistema de Reservas Laboratorio UNEG";
const REPORT_SUBTITLE = "Reporte de solicitudes de reserva";

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

const DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  ...DATE_OPTIONS,
  hour: "2-digit",
  minute: "2-digit",
};

const COLORS = {
  text: "#0a0a0a",
  secondary: "#212121",
  divider: "#cccccc",
};

function formatDate(value?: Date | string | null) {
  if (!value) return "—";
  const parsedDate = typeof value === "string" ? new Date(value) : value;
  return parsedDate.toLocaleDateString("es-ES", DATE_OPTIONS);
}

function formatDateTime(value?: Date | string | null) {
  if (!value) return "—";
  const parsedDate = typeof value === "string" ? new Date(value) : value;
  return parsedDate.toLocaleString("es-ES", DATETIME_OPTIONS);
}

function safeLabel(value?: string | null, fallback = "—") {
  return value ? value : fallback;
}

function formatTimeRange(reserva: Reservation) {
  if (reserva.defaultStartTime && reserva.defaultEndTime) {
    return `${reserva.defaultStartTime} – ${reserva.defaultEndTime}`;
  }
  if (reserva.defaultStartTime) return reserva.defaultStartTime;
  return "—";
}

export function applyDashboardReportTemplate(
  doc: PDFKit.PDFDocument,
  reservas: Reservation[],
) {
  const generatedAt = formatDateTime(new Date());

  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(COLORS.text)
    .text(REPORT_TITLE);
  doc.fontSize(12).text(REPORT_SUBTITLE, { continued: false });
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.secondary)
    .text(`Fecha de generación: ${generatedAt}`, { align: "right" });
  doc.moveDown(0.5);

  const rightEdge =
    doc.page.width - (doc.page.margins?.right ?? doc.page.width * 0.1);
  doc
    .lineWidth(0.5)
    .strokeColor(COLORS.divider)
    .moveTo(doc.x, doc.y)
    .lineTo(rightEdge, doc.y)
    .stroke();
  doc.moveDown(0.5);

  doc.moveDown(0.75);

  reservas.forEach((reserva, index) => {
    const reserveName = reserva.name ?? "Solicitud sin título";
    const stateName = safeLabel(reserva.state?.name);
    const labName = safeLabel(reserva.laboratory?.name);
    const typeName = safeLabel(reserva.type?.name);
    const teacherName = safeLabel(reserva.user?.name);
    const contactInfo = safeLabel(reserva.user?.email);
    const dateRange = `${formatDate(reserva.startDate)} – ${formatDate(
      reserva.endDate,
    )}`;
    const timeRange = formatTimeRange(reserva);
    const createdAt = formatDateTime(reserva.createdAt ?? reserva.startDate);

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLORS.text)
      .text(`${index + 1}. ${reserveName}`);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.secondary)
      .text(
        `Laboratorio: ${labName} · Tipo: ${typeName} · Estado: ${stateName}`,
      );
    doc.text(`Fechas: ${dateRange} · Horario: ${timeRange}`);
    doc.text(`Encargado: ${teacherName} · Contacto: ${contactInfo}`);
    doc.text(`Creado: ${createdAt}`);
    doc.moveDown(0.75);
  });
}
