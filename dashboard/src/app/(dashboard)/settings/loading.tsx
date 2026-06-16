import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar nav skeleton */}
          <nav className="lg:sticky lg:top-20 lg:self-start">
            <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
              {Array.from({ length: 7 }).map((_, i) => (
                <li key={i} className="shrink-0">
                  <div className="flex items-center gap-2 rounded-md px-3 py-2">
                    <Skeleton className="h-4 w-4 shrink-0 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content skeleton — mimics a typical section card */}
          <div className="min-w-0">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-5 w-44" />
                </div>
                <Skeleton className="h-4 w-72 max-w-full" />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Skeleton className="h-10 w-36" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
