import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Event } from '@/lib/events-data'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface EventFormProps {
    event: Event | null
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onCancel: () => void
    saving: boolean
}

export default function EventForm({ event, onSubmit, onCancel, saving }: EventFormProps) {
    const [imagePreview, setImagePreview] = useState<string>(event?.image || '')
    const [isDragging, setIsDragging] = useState(false)
    const [generatedId, setGeneratedId] = useState<string>('')

    const generateIdFromTitle = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!event) {
            setGeneratedId(generateIdFromTitle(e.target.value))
        }
    }

    const handleImageChange = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        
        const file = e.dataTransfer.files[0]
        if (file) {
            handleImageChange(file)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleImageChange(file)
        }
    }

    const removeImage = () => {
        setImagePreview('')
    }
    return (
        <div className="bg-card border border-border rounded-lg p-8">
            <form onSubmit={onSubmit} className="space-y-6">
                {!event && (
                    <div className="space-y-2">
                        <Label htmlFor="id">Event ID</Label>
                        <Input
                            id="id"
                            name="id"
                            required
                            value={generatedId}
                            readOnly
                            placeholder="gift-wrapping-masterclass"
                            className="cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">Auto-generated from the event title</p>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            name="title"
                            required
                            defaultValue={event?.title}
                            placeholder="Gift Wrapping Masterclass"
                            onChange={handleTitleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            name="category"
                            required
                            defaultValue={event?.category}
                            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                            <option value="workshop">Workshop</option>
                            <option value="celebration">Celebration</option>
                            <option value="masterclass">Masterclass</option>
                            <option value="experience">Experience</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Input
                        id="description"
                        name="description"
                        required
                        defaultValue={event?.description}
                        placeholder="Brief description of the event"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="longDescription">Full Description</Label>
                    <textarea
                        id="longDescription"
                        name="longDescription"
                        required
                        defaultValue={event?.longDescription}
                        rows={4}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        placeholder="Detailed description of the event"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            name="date"
                            required
                            defaultValue={event?.date}
                            placeholder="December 15, 2025"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                            id="time"
                            name="time"
                            required
                            defaultValue={event?.time}
                            placeholder="2:00 PM - 5:00 PM"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            required
                            defaultValue={event?.price}
                            placeholder="25000"
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            required
                            defaultValue={event?.location}
                            placeholder="Lagos, Nigeria"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input
                            id="venue"
                            name="venue"
                            required
                            defaultValue={event?.venue}
                            placeholder="ÈBÙN Studio, Victoria Island"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="availableTickets">Available Tickets</Label>
                    <Input
                        id="availableTickets"
                        name="availableTickets"
                        type="number"
                        required
                        defaultValue={event?.availableTickets}
                        placeholder="20"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Event Image</Label>
                    <input
                        type="hidden"
                        id="image"
                        name="image"
                        value={imagePreview}
                    />
                    
                    {imagePreview ? (
                        <div className="relative w-full h-64 border-2 border-border rounded-lg overflow-hidden group">
                            <Image
                                src={imagePreview}
                                alt="Event preview"
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full cursor-pointer"
                            >
                                <X className="h-4 w-4 text-white" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`relative w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                                isDragging
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => document.getElementById('image-file-input')?.click()}
                        >
                            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground text-center px-4">
                                Drag and drop an image here, or click to select
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Recommended: 1200x800px or larger
                            </p>
                            <input
                                id="image-file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileInput}
                                className="hidden"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                    <Input
                        id="highlights"
                        name="highlights"
                        defaultValue={event?.highlights?.join(', ')}
                        placeholder="Professional wrapping techniques, Materials included, Certificate"
                    />
                </div>

                <div className="flex gap-4 pt-6">
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Event'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}
