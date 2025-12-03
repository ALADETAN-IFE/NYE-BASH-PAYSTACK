"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, XCircle, Loader2, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from "axios"

interface OrderDetails {
    id: string
    eventTitle: string
    customerName: string
    email: string
    quantity: number
    totalPrice: number
    reference: string
    paidAt?: string
}

export default function PaymentCallbackContent() {
    const searchParams = useSearchParams()
    const reference = searchParams.get("reference")

    const [status, setStatus] = useState<"verifying" | "success" | "failed" | "pending">(() => 
        reference ? "verifying" : "failed"
    )
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const [error, setError] = useState<string>(() => 
        reference ? "" : "No payment reference found"
    )

    useEffect(() => {
        if (!reference) {
            return
        }

        const verifyPayment = async () => {
            try {
                const response = await axios.get(`/api/payment/verify?reference=${reference}`)

                if (response.data.success && response.data.status === "paid") {
                    setStatus("success")
                    setOrder(response.data.order)
                } else if(response.data.status === "pending") {
                    setStatus("pending")
                } else {
                    setStatus("failed")
                    setError(response.data.error || "Payment verification failed")
                }
            } catch (err) {
                console.error("Payment verification error:", err)
                setStatus("failed")
                setError(
                    axios.isAxiosError(err) && err.response?.data?.error
                        ? err.response.data.error
                        : "Failed to verify payment"
                )
            }
        }

        verifyPayment()
    }, [reference])

    if (status === "verifying") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold text-foreground">
                        Verifying Payment...
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        Please wait while we confirm your transaction
                    </p>
                </div>
            </div>
        )
    }

    if (status === "pending") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="rounded-2xl border border-border bg-card p-8 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
                            <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
                        </div>
                        <h2 className="mt-6 text-2xl font-semibold text-foreground">
                            Payment Pending
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Your payment is still being processed. Please check back in a few
                            moments or check your email for confirmation.
                        </p>

                        <div className="mt-8 space-y-3">
                            <Button asChild className="w-full">
                                <Link href="/">Back to Events</Link>
                            </Button>
                            <Button 
                              onClick={() => window.location.reload()}
                              variant="outline"
                              className="w-full"
                            >
                               Refresh Status
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (status === "failed") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="rounded-2xl border border-border bg-card p-8 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                            <XCircle className="h-10 w-10 text-destructive" />
                        </div>
                        <h2 className="mt-6 text-2xl font-semibold text-foreground">
                            Payment Failed
                        </h2>
                        <p className="mt-3 text-muted-foreground">{error}</p>

                        <div className="mt-8 space-y-3">
                            <Button asChild className="w-full">
                                <Link href="/">Back to Events</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={`/${reference?.split('-')[1] || ''}`}>Try Again</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Success state
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold text-foreground">
                        Payment Successful!
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        Thank you for your purchase. A confirmation email has been sent to{" "}
                        <span className="font-medium text-foreground">{order?.email}</span>
                    </p>

                    {/* Order Details */}
                    {order && (
                        <div className="mt-6 rounded-xl bg-secondary p-6 text-left space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-border">
                                <Ticket className="h-6 w-6 text-primary" />
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Event</p>
                                    <p className="font-semibold text-foreground">{order.eventTitle}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name</span>
                                    <span className="font-medium text-foreground">{order.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tickets</span>
                                    <span className="font-medium text-foreground">{order.quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Reference</span>
                                    <span className="font-mono text-xs text-foreground">{order.reference}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-border">
                                <span className="font-semibold text-foreground">Total Paid</span>
                                <span className="text-2xl font-bold text-primary">
                                    ₦{order.totalPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 space-y-3">
                        <Button asChild className="w-full">
                            <Link href="/">Browse More Events</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={`/receipt/${order?.reference}`}>View Receipt</Link>
                        </Button>
                    </div>

                    <p className="mt-6 text-xs text-muted-foreground">
                        Save this reference number for your records
                    </p>
                </div>
            </div>
        </div>
    )
}
