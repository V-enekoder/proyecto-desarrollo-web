import { Injectable } from "@nestjs/common";
import PDFDocument from "pdfkit";
import { ReservationsService } from "../reservations/reservations.service.js";
import { Readable } from "node:stream";
import { applyDashboardReportTemplate } from "./dashboard-report-template.js";

@Injectable()
export class DashboardService {
  constructor(private readonly reservationsService: ReservationsService) {}

  async generatePdf(user: Express.User): Promise<Readable> {
    const { data: reservas } = await this.reservationsService.search(
      { path: "", page: 1, limit: 1000 },
      user,
    );
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    applyDashboardReportTemplate(doc, reservas);

    doc.end();
    return Readable.from(doc);
  }
}
