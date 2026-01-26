import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CreateUserModalContent } from "./create-user-modal-content";

interface Props {
  onCreated?: (id: string) => void;
}

export function CreateUserModal({ onCreated }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Crear Usuario</Button>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Usuario</DialogTitle>
            <DialogDescription>
              Registra un nuevo usuario para el sistema.
            </DialogDescription>
          </DialogHeader>

          <CreateUserModalContent
            onCreated={(id) => {
              setOpen(false);
              onCreated?.(id);
            }}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
