import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Event from '@/model/Event';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from '@/lib/cloudinary-server';

// GET - Fetch all events or single event by ID
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // match documents where deleted is not true (covers false OR missing field)
      const event = await Event.findOne({ id, deleted: { $ne: true } });
      console.log("Event", event)
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json(event);
    }

  // Only return non-deleted events (treat missing `deleted` as not deleted)
  const events = await Event.find({ deleted: { $ne: true } }).sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      id,
      title,
      description,
      longDescription,
      date,
      time,
      location,
      venue,
      price,
      currency,
      availableTickets,
      category,
      highlights,
      image,
    } = body;

    // Validate required fields
    if (
      !id ||
      !title ||
      !description ||
      !date ||
      !time ||
      !location ||
      !venue
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if event ID already exists
    const existingEvent = await Event.findOne({ id });
    if (existingEvent) {
      return NextResponse.json(
        { error: 'Event ID already exists' },
        { status: 409 }
      );
    }

    let imageUrl = image;
    let cloudinaryPublicId;

    // Upload image to Cloudinary if base64 string provided
    if (image && image.startsWith('data:image')) {
      const uploadResult = await uploadToCloudinary(image, 'nye-bash/events');
      imageUrl = uploadResult.secure_url;
      cloudinaryPublicId = uploadResult.public_id;
    }

    const newEvent = await Event.create({
      id,
      title,
      description,
      longDescription,
      date,
      time,
      location,
      venue,
      image: imageUrl,
      cloudinaryPublicId,
      price,
      currency: currency || '₦',
      availableTickets,
      category,
      highlights: highlights || [],
    });

    return NextResponse.json(
      { success: true, event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// PUT - Update existing event
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { id, image, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Only allow updates on non-deleted events (handles older docs without the field)
    const existingEvent = await Event.findOne({ id, deleted: { $ne: true } });
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    let imageUrl = image;
    let cloudinaryPublicId = existingEvent.cloudinaryPublicId;

    // Handle image update
    if (image && image.startsWith('data:image')) {
      // Delete old image from Cloudinary if exists
      if (existingEvent.cloudinaryPublicId) {
        await deleteFromCloudinary(existingEvent.cloudinaryPublicId);
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(image, 'nye-bash/events');
      imageUrl = uploadResult.secure_url;
      cloudinaryPublicId = uploadResult.public_id;
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { id },
      {
        ...updateData,
        image: imageUrl,
        cloudinaryPublicId,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const event = await Event.findOne({ id });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Soft-delete: mark the event as deleted instead of removing it.
    // We intentionally do NOT delete the Cloudinary image so the event can be restored if needed.
    await Event.findOneAndUpdate(
      { id },
      { deleted: true, deletedAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      message: 'Event deleted (soft) successfully',
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
