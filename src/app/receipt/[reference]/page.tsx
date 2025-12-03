import { Suspense } from "react"
import ReceiptContent from "./receipt-content"
import { Loader2 } from "lucide-react"

export default function ReceiptPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                    <p className="mt-4 text-muted-foreground">Loading receipt...</p>
                </div>
            </div>
        }>
            <ReceiptContent />
        </Suspense>
    )
}
