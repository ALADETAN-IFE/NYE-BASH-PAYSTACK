import mongoose, { Schema, Document } from 'mongoose'

export interface IOrder extends Document {
    eventId: string
    eventTitle: string
    customerName: string
    email: string
    phone: string
    quantity: number
    totalPrice: number
    status: 'pending' | 'paid' | 'failed' | 'cancelled'
    paystackReference: string
    paystackAuthorizationUrl?: string
    createdAt: Date
    paidAt?: Date
}

const OrderSchema = new Schema<IOrder>(
    {
        eventId: {
            type: String,
            required: true,
            index: true,
        },
        eventTitle: {
            type: String,
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'cancelled'],
            default: 'pending',
            required: true,
        },
        paystackReference: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        paystackAuthorizationUrl: {
            type: String,
        },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
)

// Index for faster queries
OrderSchema.index({ email: 1, createdAt: -1 })
OrderSchema.index({ status: 1, createdAt: -1 })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
