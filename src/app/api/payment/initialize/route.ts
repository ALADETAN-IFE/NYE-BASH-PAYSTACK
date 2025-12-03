import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Event from '@/model/Event';
import Order from '@/model/Order';

const PAYSTACK_API_URL =
  'https://api.paystack.co/transaction/initialize';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, quantity, customerName, email, phone } = body;

    // Validate required fields
    if (!eventId || !quantity || !customerName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

  // Get event details
  // Only allow initializing payment for non-deleted events (also matches docs missing `deleted`)
  const event = await Event.findOne({ id: eventId, deleted: { $ne: true } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check ticket availability
    if (event.availableTickets < quantity) {
      return NextResponse.json(
        { error: `Only ${event.availableTickets} tickets available` },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalPrice = event.price * quantity;

    // Generate unique reference
    const reference = `NYE-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)
      .toUpperCase()}`;

    // Create order in database
    const order = await Order.create({
      eventId: event.id,
      eventTitle: event.title,
      customerName,
      email,
      phone,
      quantity,
      totalPrice,
      status: 'pending',
      paystackReference: reference,
    });

    // Initialize Paystack payment
    const paystackResponse = await fetch(PAYSTACK_API_URL, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        reference,
        amount: totalPrice * 100, // Paystack expects amount in kobo (smallest currency unit)
        email,
        currency: 'NGN',
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'], // Enable multiple payment channels
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback?reference=${reference}`,
        metadata: {
          customerName,
          phone,
          eventId: event.id,
          eventTitle: event.title,
          quantity,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) { 
      console.error('Paystack initialization failed:', paystackData);
      return NextResponse.json(
        {
          error: 'Payment initialization failed',
          details: paystackData.message,
        },
        { status: 500 }
      );
    }

    // Update order with authorization URL
    order.paystackAuthorizationUrl = paystackData.data.authorization_url;
    await order.save();

    return NextResponse.json({
      success: true,
      reference,
      checkoutUrl: paystackData.data.authorization_url,
      orderId: order._id,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
