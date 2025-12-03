'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { AlertDialog } from '@/components/ui/alert-dialog'
import EventForm from '@/components/EventForm'
import EventListItem from '@/components/EventListItem'
import EventListSkeleton from '@/components/EventListSkeleton'
import { type Event } from '@/lib/events-data'
import { Plus } from 'lucide-react'

export default function ManageEventPage() {
    const [eventList, setEventList] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [saving, setSaving] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; eventId: string | null }>({
        open: false,
        eventId: null,
    })
    const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({
        open: false,
        message: '',
    })

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/event')
            setEventList(response.data)
        } catch (error) {
            console.error('Failed to fetch events:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeleteDialog({ open: true, eventId: id })
    }

    const confirmDelete = async () => {
        if (!deleteDialog.eventId) return

        try {
            await axios.delete(`/api/event?id=${deleteDialog.eventId}1`)
            setEventList(eventList.filter(event => event.id !== deleteDialog.eventId))
        } catch (error: unknown) {
            console.error('Failed to delete event:', error)
            const err = error as { response?: { data?: { error?: string } } } | undefined
            setErrorDialog({
                open: true,
                message: 'Failed to delete event. Please try again.' + (err?.response?.data?.error ?? ''),
            })
        }
    }

    const handleEdit = (event: Event) => {
        setEditingEvent(event)
        setIsEditing(true)
    }

    const handleAddNew = () => {
        setEditingEvent(null)
        setIsEditing(true)
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSaving(true)

        const formData = new FormData(e.currentTarget)
        const eventData = {
            id: editingEvent?.id || formData.get('id') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            longDescription: formData.get('longDescription') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            location: formData.get('location') as string,
            venue: formData.get('venue') as string,
            price: Number(formData.get('price')),
            currency: '₦',
            availableTickets: Number(formData.get('availableTickets')),
            category: formData.get('category') as Event['category'],
            highlights: (formData.get('highlights') as string)?.split(',').map(h => h.trim()) || [],
            image: formData.get('image') as string,
        }

        try {
            if (editingEvent) {
                await axios.put('/api/event', eventData)
            } else {
                await axios.post('/api/event', eventData)
            }
            
            await fetchEvents()
            setIsEditing(false)
            setEditingEvent(null)
        } catch (error) {
            console.error('Failed to save event:', error)
            setErrorDialog({
                open: true,
                message: 'Failed to save event. Please try again.',
            })
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditingEvent(null)
    }

    if (isEditing) {
        return (
            <main className="min-h-screen bg-background px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-4xl font-semibold text-primary mb-2">
                            {editingEvent ? 'Edit Event' : 'Create New Event'}
                        </h1>
                        <p className="text-muted-foreground">
                            {editingEvent ? 'Update event details' : 'Add a new event to the system'}
                        </p>
                    </div>

                    <EventForm
                        event={editingEvent}
                        onSubmit={handleSave}
                        onCancel={handleCancel}
                        saving={saving}
                    />
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background px-6 py-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-semibold text-primary mb-2">
                            Manage Events
                        </h1>
                        <p className="text-muted-foreground">
                            View, edit, and manage all events
                        </p>
                    </div>
                    <Button onClick={handleAddNew} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Event
                    </Button>
                </div>

                {loading ? (
                    <EventListSkeleton />
                ) : (
                    <div className="grid lg:grid-cols-2 gap-6">
                        {eventList.map((event) => (
                            <EventListItem
                                key={event.id}
                                event={event}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {!loading && eventList.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No events found</p>
                        <Button onClick={handleAddNew} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Your First Event
                        </Button>
                    </div>
                )}
            </div>

            <AlertDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, eventId: null })}
                title="Delete Event"
                description="Are you sure you want to delete this event? This action cannot be undone and all associated data will be permanently removed."
                onConfirm={confirmDelete}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />

            <AlertDialog
                open={errorDialog.open}
                onOpenChange={(open) => setErrorDialog({ open, message: '' })}
                title="Error"
                description={errorDialog.message}
                onConfirm={() => setErrorDialog({ open: false, message: '' })}
                confirmText="OK"
                variant="destructive"
            />
        </main>
    )
}
