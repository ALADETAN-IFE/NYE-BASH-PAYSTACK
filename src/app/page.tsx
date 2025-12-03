'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import EventCard from "@/components/EventCard"
import { Skeleton } from "@/components/ui/skeleton"
import { type Event } from "@/lib/events-data"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/event')
        setEvents(response.data)
      } catch (err) {
        console.error('Failed to fetch events:', err)
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <section className="relative pt-10 pb-20 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-primary sm:text-5xl lg:text-6xl">
              Events & Workshops
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground lg:text-xl">
              Immerse yourself in the art of thoughtful gifting. Join our exclusive workshops, masterclasses, and
              celebrations designed to inspire and delight.
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
                  <Skeleton className="aspect-5/3 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events available at the moment</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
