"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, Ticket, Calendar, Clock, MapPin, User, Mail, Phone, Download, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from "axios"

interface OrderDetails {
    id: string
    eventTitle: string
    eventDate: string
    eventTime: string
    eventVenue: string
    customerName: string
    email: string
    phone: string
    quantity: number
    totalPrice: number
    reference: string
    paidAt: string
}

export default function ReceiptContent() {
    const params = useParams()
    const router = useRouter()
    const reference = params.reference as string

    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/payment/verify?reference=${reference}`)

                if (response.data.success && response.data.status === "paid") {
                    setOrder(response.data.order)
                } else {
                    setError("Order not found or payment not completed")
                }
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("Failed to load receipt")
            } finally {
                setLoading(false)
            }
        }

        if (reference) {
            fetchOrder()
        }
    }, [reference])

    const handlePrint = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                    <p className="mt-4 text-muted-foreground">Loading receipt...</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h2 className="text-2xl font-semibold text-foreground">Receipt Not Found</h2>
                        <p className="mt-3 text-muted-foreground">{error}</p>
                        <Button asChild className="mt-6">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Print/Navigation Buttons */}
                <div className="flex items-center justify-between mb-6 print:hidden">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <Button onClick={handlePrint} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                    </Button>
                </div>

                {/* Receipt Container */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary text-primary-foreground p-8 text-center">
                        <h1 className="text-4xl font-bold mb-2">NYE Bash</h1>
                        <p className="text-lg opacity-90">Payment Receipt</p>
                    </div>

                    {/* Receipt Content */}
                    <div className="p-8 space-y-8">
                        {/* Status Banner */}
                        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                            <p className="text-green-800 dark:text-green-200 font-semibold text-lg">
                                ✓ Payment Confirmed
                            </p>
                            <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                                {new Date(order.paidAt).toLocaleString('en-NG', { 
                                    dateStyle: 'long', 
                                    timeStyle: 'short',
                                    timeZone: 'Africa/Lagos'
                                })}
                            </p>
                        </div>

                        {/* Reference Number */}
                        <div className="bg-secondary rounded-lg p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Reference Number</p>
                            <p className="text-2xl font-bold font-mono text-foreground">{order.reference}</p>
                        </div>

                        {/* Event Details */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Ticket className="h-5 w-5" />
                                Event Details
                            </h2>
                            <div className="space-y-4 bg-secondary/50 rounded-lg p-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Event Name</p>
                                    <p className="text-lg font-semibold text-foreground">{order.eventTitle}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date</p>
                                            <p className="font-medium text-foreground">{order.eventDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Time</p>
                                            <p className="font-medium text-foreground">{order.eventTime}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Venue</p>
                                        <p className="font-medium text-foreground">{order.eventVenue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Information
                            </h2>
                            <div className="space-y-3 bg-secondary/50 rounded-lg p-6">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Name</p>
                                        <p className="font-medium text-foreground">{order.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium text-foreground">{order.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium text-foreground">{order.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-4">Payment Summary</h2>
                            <div className="bg-secondary/50 rounded-lg p-6 space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-muted-foreground">Tickets</span>
                                    <span className="font-medium text-foreground">{order.quantity}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-muted-foreground">Price per ticket</span>
                                    <span className="font-medium text-foreground">
                                        ₦{(order.totalPrice / order.quantity).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-border">
                                    <span className="text-lg font-semibold text-foreground">Total Amount Paid</span>
                                    <span className="text-2xl font-bold text-primary">
                                        ₦{order.totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Important Notice */}
                        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <p className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                                📌 Important Information
                            </p>
                            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 ml-4">
                                <li>• Please bring this receipt or your reference number to the event</li>
                                <li>• Check-in begins 30 minutes before the event start time</li>
                                <li>• This receipt serves as proof of purchase</li>
                            </ul>
                        </div>

                        {/* Footer */}
                        <div className="text-center pt-6 border-t border-border print:hidden">
                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/">Browse More Events</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Print Footer */}
                    <div className="hidden print:block p-8 border-t border-border text-center text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} NYE Bash. All rights reserved.</p>
                        <p className="mt-1">For inquiries, contact us at ifecodes01@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
