import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";
import {type Event } from "@/lib/events-data";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link
      key={event.id}
      href={`/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-5/3 overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary-foreground">
            {event.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-border">
          <div>
            <span className="text-2xl font-semibold text-foreground">
              {event.currency}
              {event.price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Ticket className="h-4 w-4" />
            <span>{event.availableTickets} left</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
