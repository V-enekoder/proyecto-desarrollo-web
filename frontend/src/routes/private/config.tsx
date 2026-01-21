import { LaboratoriesManager } from "@/components/config/laboratories-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";

export default function Config() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between px-8 pt-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">
            Administra los laboratorios, usuarios y parámetros del sistema.
          </p>
        </div>
      </div>

      <Tabs defaultValue="laboratories" className="flex-1 space-y-3">
        <div className="px-4">
          <TabsList>
            <TabsTrigger value="laboratories">Laboratorios</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="laboratories" className="size-full">
          <Suspense fallback={<Skeleton className="h-150 w-full" />}>
            <LaboratoriesManager />
          </Suspense>
        </TabsContent>

        <TabsContent value="users">
          <div className="rounded-lg border border-dashed p-20 text-center">
            <h3 className="text-lg font-medium">Gestión de Usuarios</h3>
            <p className="text-muted-foreground">
              Próximamente estaremos implementando la sección de usuarios.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="general">
          <div className="rounded-lg border border-dashed p-20 text-center">
            <h3 className="text-lg font-medium">Configuración General</h3>
            <p className="text-muted-foreground">
              Opciones generales del sistema en desarrollo.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
