import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="p-6 space-y-6 max-w-3xl">
        <Skeleton className="h-4 w-32" />
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </CardHeader>
          <CardContent className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="flex justify-end gap-2 border-t border-border pt-5">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-28" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
