import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TicketPurchaseForm from "@/components/ticket-purchase-form";
import { Calendar, MapPin, Clock, ArrowLeft, Check } from "lucide-react";
import axios from "axios";
import type { Event } from "@/lib/events-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await axios.get(`${baseUrl}/api/event?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

async function getAllEvents() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await axios.get(`${baseUrl}/api/event`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event: Event) => ({
    id: event.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `${event.title}`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      // include event image if available
      images: event.image ? [event.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: event.image ? [event.image] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back Link */}
      <div className="pt-10 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Event Content */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-3">
              <div className="relative aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium uppercase tracking-wider text-primary-foreground">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h1 className="text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
                  {event.title}
                </h1>

                <div className="mt-6 flex flex-wrap gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-foreground">
                    About This Event
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {event.longDescription}
                  </p>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-foreground">
                    What&apos;s Included
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {event?.highlights?.map(
                      (highlight: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-4 w-4 text-primary" />
                          </span>
                          <span className="text-muted-foreground">
                            {highlight}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Purchase Form */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <TicketPurchaseForm event={event} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
