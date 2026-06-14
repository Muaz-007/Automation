import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="p-6 space-y-6">
        <Skeleton className="h-7 w-48" />
        <Card>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 border-b border-border px-6 py-4 last:border-0"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-72" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
