import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { reservationsService } from "@/services/reservations";
import type { Reservation } from "@uneg-lab/api-types/reservation";

export function ReservationsTable() {
  const { data: reservas } = useSuspenseQuery<Reservation[]>({
    queryKey: ["reservations"],
    queryFn: () => reservationsService.getAll(),
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservas.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.id}</TableCell>
            <TableCell>{r.name}</TableCell>
            <TableCell>{new Date(r.startDate).toLocaleDateString()}</TableCell>
            <TableCell>
              {r.state?.name === "Pendiente" && (
                <Badge variant="destructive">{r.state?.name}</Badge>
              )}
              {r.state?.name === "Aprobada" && (
                <Badge variant="secondary">{r.state?.name}</Badge>
              )}
              {r.state?.name === "Cancelada" && (
                <Badge variant="outline">{r.state?.name}</Badge>
              )}
            </TableCell>
            <TableCell>{(r as any).type?.name ?? "—"}</TableCell>
            <TableCell>
              <Button asChild variant="link" size="sm">
                <Link to={`/reservas/${r.id}`}>Detalles</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
