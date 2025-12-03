"use client";

import type React from "react"

import { useState } from "react"
import { Minus, Plus, Ticket, CreditCard, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Event } from "@/lib/events-data"
import axios from "axios"

interface TicketPurchaseFormProps {
  event: Event
}

export default function TicketPurchaseForm({ event }: TicketPurchaseFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxTickets = Math.min(event.availableTickets, 10)
  const totalPrice = event.price * quantity

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(maxTickets, prev + delta)))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const customerName = `${formData.firstName} ${formData.lastName}`
      
      const response = await axios.post('/api/payment/initialize', {
        eventId: event.id,
        quantity,
        customerName,
        email: formData.email,
        phone: formData.phone,
      })

      if (response.data.success && response.data.checkoutUrl) {
        // Redirect to Paystack checkout
        window.location.href = response.data.checkoutUrl
      } else {
        setError('Failed to initialize payment. Please try again.')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Payment initialization error:', err)
      setError(
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'An error occurred. Please try again.'
      )
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Price per ticket</p>
          <p className="text-3xl font-semibold text-foreground">
            {event.currency}
            {event.price.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
          <Ticket className="h-4 w-4" />
          <span>{event.availableTickets} available</span>
        </div>
      </div>

      {event.availableTickets === 0 ? (
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>This event is sold out</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <Label className="text-sm font-medium text-foreground">Number of Tickets</Label>
            <div className="mt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-xl font-semibold text-foreground">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxTickets}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="mt-1.5"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="mt-1.5"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1.5"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="mt-1.5"
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl bg-secondary p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {quantity} x Ticket{quantity > 1 ? "s" : ""}
              </span>
              <span className="text-foreground">
                {event.currency}
                {(event.price * quantity).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-semibold text-primary">
                {event.currency}
                {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-medium">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Purchase Tickets
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By purchasing, you agree to our terms and conditions.
          </p>
        </form>
      )}
    </div>
  )
}
