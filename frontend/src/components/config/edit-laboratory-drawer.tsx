import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { extractErrorMessages } from "@/lib/api";
import {
  laboratoriesService,
  UpdateLaboratorySchema,
  type Laboratory,
  type UpdateLaboratoryDto,
} from "@/services/laboratories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface EditLaboratoryDrawerProps {
  laboratory: Laboratory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function EditLaboratoryDrawer({
  laboratory,
  open,
  onOpenChange,
  onDeleted,
}: EditLaboratoryDrawerProps) {
  const formId = useId();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateLaboratoryDto>({
    resolver: zodResolver(UpdateLaboratorySchema),
    values: laboratory ?? undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateLaboratoryDto) =>
      laboratoriesService.update(laboratory!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laboratories"] });
      onOpenChange(false);
    },
    onError: async (err) => {
      const [message] = await extractErrorMessages(err);
      setError(message ?? "No se pudo actualizar el laboratorio.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => laboratoriesService.delete(laboratory!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laboratories"] });
      setDeleteOpen(false);
      onOpenChange(false);
      onDeleted();
    },
    onError: async (err) => {
      const [message] = await extractErrorMessages(err);
      setDeleteError(message ?? "No se pudo eliminar el laboratorio.");
    },
  });

  const onSubmit = (data: UpdateLaboratoryDto) => {
    setError(null);
    updateMutation.mutate(data);
  };

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        direction={isDesktop ? "right" : "bottom"}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edición rápida</DrawerTitle>
            <DrawerDescription>
              {laboratory ? `Laboratorio ${laboratory.name}` : "Cargando..."}
            </DrawerDescription>
          </DrawerHeader>

          {laboratory && (
            <form
              id={formId}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 p-4 text-left"
            >
              <div className="text-xs text-slate-500">ID: {laboratory.id}</div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Nombre del Laboratorio
                </label>
                <Input {...register("name")} />
                {errors.name && (
                  <p className="text-destructive text-xs">
                    {errors.name.message}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Nombre descriptivo visible para los usuarios.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Número de Laboratorio
                </label>
                <Input
                  type="number"
                  {...register("number", { valueAsNumber: true })}
                />
                {errors.number && (
                  <p className="text-destructive text-xs">
                    {errors.number.message}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Código único de identificación de sala.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Estado del Laboratorio
                  </p>
                  <p className="text-xs text-slate-500">
                    Habilitar acceso y reservas
                  </p>
                </div>
                <Controller
                  control={control}
                  name="active"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-xs text-slate-400">
                        {field.value ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  )}
                />
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}
            </form>
          )}
          <DrawerFooter>
            <Button
              variant="destructive"
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => setDeleteOpen(true)}
            >
              Eliminar
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                type="button"
                disabled={updateMutation.isPending}
              >
                Cancelar
              </Button>
            </DrawerClose>
            <Button
              form={formId}
              type="submit"
              disabled={!isDirty || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Dialog
        open={deleteOpen}
        onOpenChange={(val) => {
          setDeleteOpen(val);
          if (!val) setDeleteError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar laboratorio</DialogTitle>
            <DialogDescription>
              {laboratory
                ? `Se eliminará "${laboratory.name}" y esta acción no se puede deshacer.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-destructive text-sm">{deleteError}</p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              type="button"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
