import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usersService, type User } from "@/services/users";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CreateUserModal } from "./create-user-modal";
import { ViewUserDrawer } from "./view-user-drawer";

export function UsersManager() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = async () => {
    setError(null);
    setResult(null);
    try {
      const user = await usersService.getByUsername(query.trim());
      setResult(user);
      setDrawerOpen(true);
    } catch (err: any) {
      setError(err?.message ?? "No se encontró el usuario");
    }
  };

  return (
    <section className="min-h-full bg-linear-to-br from-gray-50 to-gray-100 text-slate-900">
      <div className="relative flex h-full flex-col">
        <header className="border-b bg-white px-8 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Gestión de Usuarios
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Busca por nombre de usuario, crea nuevos usuarios y revisa sus
                detalles.
              </p>
            </div>
            <CreateUserModal
              onCreated={async (id) => {
                setQuery("");
                setError(null);
                try {
                  const u = await usersService.getById(id);
                  setResult(u);
                  setDrawerOpen(true);
                } catch {
                  setResult(null);
                }
              }}
            />
          </div>
        </header>

        <div className="bg-linear-to-br from-gray-50 to-gray-100 px-8 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Input
                className="w-full"
                placeholder="Buscar por username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <Button onClick={handleSearch}>Buscar</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setResult(null);
                    setError(null);
                  }}
                >
                  Limpiar
                </Button>
              </div>
              {error && (
                <p className="text-destructive mt-2 text-sm">{error}</p>
              )}
            </div>
          </div>
        </div>

        <div className="relative px-8 pt-2 pb-8">
          {result ? (
            <div className="max-w-md">
              <div className="group hover:border-primary/50 relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-base font-bold">{result.name}</h3>
                    <Badge className="bg-slate-100 text-slate-700">
                      @{result.username}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground text-sm">
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{result.email ?? "—"}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Rol:</span>
                      <span className="ml-2">{result.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-20 text-center">
              <h3 className="text-lg font-medium">Busca un usuario</h3>
              <p className="text-muted-foreground">
                Usa el campo de búsqueda para encontrar usuarios por su
                username.
              </p>
            </div>
          )}
        </div>

        <ViewUserDrawer
          userId={result?.id ?? null}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      </div>
    </section>
  );
}
