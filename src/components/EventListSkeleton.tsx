import { Skeleton } from '@/components/ui/skeleton'

export default function EventListSkeleton() {
    return (
        <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card  border border-border rounded-lg p-6">
                    <div className="flex gap-6 flex-col md:flex-row">
                        <Skeleton className="shrink-0 w-48 h-32 rounded-lg" />
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <div className="grid grid-cols-4 gap-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
