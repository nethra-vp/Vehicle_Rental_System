import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { isVehicleAvailable, calculateTotalPrice } from '@/lib/utils';
import Vehicle from '@/models/Vehicle';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const vehicleId = searchParams.get('vehicleId');

    let query = {};
    if (userId) query.userId = userId;
    if (vehicleId) query.vehicleId = vehicleId;

    const bookings = await Booking.find(query)
      .populate('vehicleId')
      .populate('userId')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, vehicleId, startDate, endDate } = body;

    // 1. Validation: Minimum 1 day
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return NextResponse.json({ success: false, error: 'End date cannot be before start date' }, { status: 400 });
    }

    // 2. Check availability
    const existingBookings = await Booking.find({ 
      vehicleId, 
      status: 'confirmed' 
    });

    if (!isVehicleAvailable(existingBookings, startDate, endDate)) {
      return NextResponse.json({ success: false, error: 'Vehicle is already booked for these dates' }, { status: 400 });
    }

    // 3. Get vehicle price
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });

    const totalPrice = calculateTotalPrice(startDate, endDate, vehicle.pricePerDay);

    // 4. Create booking
    const booking = await Booking.create({
      userId,
      vehicleId,
      startDate,
      endDate,
      totalPrice,
      status: 'confirmed'
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
