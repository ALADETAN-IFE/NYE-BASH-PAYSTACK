import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Event from '@/model/Event';
import Order from '@/model/Order';
import {
  sendTicketConfirmationEmail,
  sendAdminNotification,
} from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      console.error('No signature provided in webhook');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 401 }
      );
    }

    // Get raw body for signature verification
    const body = await request.text();

    // Verify webhook signature using Paystack secret key
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid webhook signature - Hash mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the verified payload
    const parsedBody = JSON.parse(body);

    // Extract event data from the verified payload
    const { event: eventType, data: paymentData } = parsedBody;

    // Only process successful charge events
    if (eventType !== 'charge.success') {
      return NextResponse.json({ received: true });
    }

    const reference = paymentData.reference;
    const status = paymentData.status;

    if (!reference) {
      console.error('No reference in webhook data');
      return NextResponse.json(
        { error: 'No reference provided' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the order
    const order = await Order.findOne({ paystackReference: reference });

    if (!order) {
      console.error(`Order not found for reference: ${reference}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If already processed, return success
    if (order.status === 'paid') {
      return NextResponse.json({
        received: true,
        message: 'Already processed',
      });
    }

    // Update order status based on payment status
    if (status === 'success') {
      order.status = 'paid';
      order.paidAt = new Date();
      await order.save();

  // Decrement available tickets (treat missing `deleted` as not deleted)
  const event = await Event.findOne({ id: order.eventId, deleted: { $ne: true } });
      if (event) {
        event.availableTickets = Math.max(
          0,
          event.availableTickets - order.quantity
        );
        await event.save();
        console.log(
          `Decremented tickets for event ${event.id}. New count: ${event.availableTickets}`
        );

        // Send both emails in parallel and wait for completion
        const emailResults = await Promise.allSettled([
          sendTicketConfirmationEmail(order.email, {
            customerName: order.customerName,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            eventVenue: event.venue,
            quantity: order.quantity,
            phone: order.phone,
            totalPrice: order.totalPrice,
            reference: order.paystackReference,
          }),
          sendAdminNotification(
            event.title,
            order.customerName,
            order.email,
            order.quantity,
            order.totalPrice,
            order.paystackReference
          ),
        ]);

        // Log email results
        if (emailResults[0].status === 'rejected') {
          console.error(
            'Webhook - Failed to send customer email:',
            emailResults[0].reason
          );
        }
        if (emailResults[1].status === 'rejected') {
          console.error(
            'Webhook - Failed to send admin notification:',
            emailResults[1].reason
          );
        }
      }

      console.log(
        `Payment confirmed for order ${order._id}, reference: ${reference}`
      );
    } else if (status === 'failed') {
      order.status = 'failed';
      await order.save();
      console.log(
        `Payment failed for order ${order._id}, reference: ${reference}`
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
