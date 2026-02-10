import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dashboardService } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon, FileDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PdfPreview = { url: string; name: string };

export function DashboardPdfModal() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: pdfFile,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "pdf-preview"],
    queryFn: ({ signal }) => dashboardService.downloadPdf(signal),
    enabled: isOpen,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const pdfPreview = useMemo<PdfPreview | null>(() => {
    if (!pdfFile) return null;
    return { url: URL.createObjectURL(pdfFile), name: pdfFile.name };
  }, [pdfFile]);

  useEffect(() => {
    return () => {
      if (pdfPreview) {
        URL.revokeObjectURL(pdfPreview.url);
      }
    };
  }, [pdfPreview]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      refetch();
    }
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : "No se pudo cargar la vista previa.";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <EyeIcon className="h-3 w-3" />
          <span className="ml-2 text-xs font-medium tracking-wide uppercase">
            Ver PDF
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Reporte de reservas</DialogTitle>
          <DialogDescription>
            Vista previa del archivo generado por el panel.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 min-h-80">
          {isFetching ? (
            <div className="text-muted-foreground flex h-60 w-full items-center justify-center text-sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando vista previa...
            </div>
          ) : error ? (
            <div className="text-destructive flex h-60 w-full items-center justify-center text-sm">
              {errorMessage}
            </div>
          ) : pdfPreview ? (
            <div className="h-[60vh] min-h-90 w-full overflow-hidden rounded-lg border border-slate-200">
              <iframe
                aria-label="Vista previa del PDF"
                className="h-full w-full"
                src={pdfPreview.url}
              ></iframe>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-60 w-full items-center justify-center text-sm">
              Abre la vista previa para generar el documento.
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="ghost" size="sm">
              Cerrar
            </Button>
          </DialogClose>
          {pdfPreview && (
            <Button asChild size="sm">
              <a
                className="flex items-center gap-2"
                download={pdfPreview.name}
                href={pdfPreview.url}
              >
                <FileDown className="h-3 w-3" />
                Descargar
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
