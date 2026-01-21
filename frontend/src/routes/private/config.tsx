import { LaboratoriesManager } from "@/components/config/laboratories-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Config() {
  return (
    <Suspense fallback={<Skeleton className="h-125" />}>
      <LaboratoriesManager />
    </Suspense>
  );
}
