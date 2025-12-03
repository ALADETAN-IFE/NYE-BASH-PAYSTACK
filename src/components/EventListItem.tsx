import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { type Event } from '@/lib/events-data'
import { Calendar, MapPin, Clock, Ticket, Edit, Trash2 } from 'lucide-react'

interface EventListItemProps {
    event: Event
    onEdit: (event: Event) => void
    onDelete: (id: string) => void
}

export default function EventListItem({ event, onEdit, onDelete }: EventListItemProps) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 transition-shadow hover:shadow-lg">
        <div className="flex gap-6 flex-col min-[515px]:flex-row">
          <div className="shrink-0 w-48 h-32 relative rounded-lg overflow-hidden bg-muted max-[515px]:w-full">
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="192px"
                className="object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {event.title}
                  </h3>
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                    {event.category}
                  </span>
                  <div className="flex gap-2 min-[415px]:hidden">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => onEdit(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => onDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              </div>
              <div className="flex gap-2 max-[415px]:hidden">
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => onEdit(event)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => onDelete(event.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
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
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" />
                <span>{event.availableTickets} tickets</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">
                  {event.currency}
                  {event.price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {event.venue}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
