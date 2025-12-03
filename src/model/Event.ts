import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  image: string;
  cloudinaryPublicId?: string;
  price: number;
  currency: string;
  availableTickets: number;
  category: 'workshop' | 'celebration' | 'masterclass' | 'experience';
  highlights: string[];
  deleted?: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    venue: { type: String, required: true },
    image: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: '₦' },
    availableTickets: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ['workshop', 'celebration', 'masterclass', 'experience'],
    },
    highlights: [{ type: String }],
    // Soft delete fields
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema);
