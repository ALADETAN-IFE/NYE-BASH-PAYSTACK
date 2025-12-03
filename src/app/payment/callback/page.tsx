import { Suspense } from "react"
import PaymentCallbackContent from "./callback-content"
import { Loader2 } from "lucide-react"

export default function PaymentCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold text-foreground">
                        Loading...
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        Please wait
                    </p>
                </div>
            </div>
        }>
            <PaymentCallbackContent />
        </Suspense>
    )
}
