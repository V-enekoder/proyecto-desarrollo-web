import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { type Laboratory } from "@/services/laboratories";
import { EditLaboratoryDrawerContent } from "./edit-laboratory-drawer-content";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        direction={isDesktop ? "right" : "bottom"}
      >
        <DrawerContent>
          <EditLaboratoryDrawerContent
            laboratory={laboratory}
            open={open}
            onOpenChange={onOpenChange}
            onDeleted={onDeleted}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
