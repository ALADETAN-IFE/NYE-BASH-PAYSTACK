import { Skeleton } from "@/components/ui/skeleton"

export default function EventDetailLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Back Link Skeleton */}
      <div className="pt-10 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      {/* Event Content Skeleton */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Left Column */}
            <div className="lg:col-span-3">
              {/* Image Skeleton */}
              <Skeleton className="aspect-video w-full rounded-2xl" />

              <div className="mt-8 space-y-6">
                {/* Title Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-10 w-1/2" />
                </div>

                {/* Meta Info Skeleton */}
                <div className="flex flex-wrap gap-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-40" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>

                {/* Highlights Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="h-6 w-40" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Skeleton */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
