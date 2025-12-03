import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Event from '@/model/Event';
import Order from '@/model/Order';
import {
  sendTicketConfirmationEmail,
  sendAdminNotification,
} from '@/lib/email';

const PAYSTACK_VERIFY_URL = 'https://api.paystack.co/transaction/verify';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find order by reference
    const order = await Order.findOne({ paystackReference: reference });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If already paid, return success
    if (order.status === 'paid') {
      // Treat missing `deleted` as not deleted
      const event = await Event.findOne({ id: order.eventId, deleted: { $ne: true } });
      return NextResponse.json({
        success: true,
        status: 'paid',
        order: {
          id: order._id,
          eventTitle: order.eventTitle,
          eventDate: event?.date,
          eventTime: event?.time,
          eventVenue: event?.venue,
          customerName: order.customerName,
          email: order.email,
          phone: order.phone,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          reference: order.paystackReference,
          paidAt: order.paidAt,
        },
      });
    }

    const paystackResponse = await fetch(`${PAYSTACK_VERIFY_URL}/${reference}`, { 
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error('Paystack verification failed:', paystackData);
      return NextResponse.json(
        { error: 'Payment verification failed', details: paystackData.message },
        { status: 500 }
      );
    }

    const paymentStatus = paystackData.data?.status;;

    // Update order based on payment status
    if (paymentStatus === 'success') {
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
            'Failed to send customer email:',
            emailResults[0].reason
          );
        }
        if (emailResults[1].status === 'rejected') {
          console.error(
            'Failed to send admin notification:',
            emailResults[1].reason
          );
        }
      }

      return NextResponse.json({
        success: true,
        status: 'paid',
        order: {
          id: order._id,
          eventTitle: order.eventTitle,
          eventDate: event.date,
          eventTime: event.time,
          eventVenue: event.venue,
          customerName: order.customerName,
          email: order.email,
          phone: order.phone,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          reference: order.paystackReference,
          paidAt: order.paidAt,
        },
      });
    } else if (paymentStatus === 'failed') {
      order.status = 'failed';
      await order.save();

      return NextResponse.json({
        success: false,
        status: 'failed',
        error: 'Payment failed',
      });
    } else {
      // Payment still pending
      return NextResponse.json({
        success: false,
        status: 'pending',
        error: 'Payment is still pending',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
