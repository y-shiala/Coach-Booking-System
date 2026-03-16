import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServicesService } from '../services/services.service';
import { MailService } from '../mail/mail.service';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private servicesService: ServicesService,
    private mailService: MailService, 
  ) {}

 async findAll(userId: string, role: string) {
  if (role === 'customer') {
    return this.findByUser(userId);
  } else if (role === 'coach') {
    return this.findByCoach(userId);
  }
  return [];
}


async findByUser(customerId: string) {
  return this.bookingModel
    .find({ customerId })
    .populate('customerId', 'name email')
    .populate('serviceId', 'name duration price')
    .populate('staffId', 'name email')
    .exec();
}

async findByCoach(staffId: string) {
  return this.bookingModel
    .find({ staffId })
    .populate('customerId', 'name email')
    .populate('serviceId', 'name duration price')
    .populate('staffId', 'name email')
    .exec();
}

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid booking ID');
    const booking = await this.bookingModel
      .findById(id)
      .populate('customerId', 'name email')
      .populate('serviceId', 'name duration price')
      .populate('staffId', 'name email')
      .exec();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async create(dto: CreateBookingDto, customerId: string) {
  const { serviceId, startTime } = dto;

  const service = await this.servicesService.findById(serviceId);
  const staffId = service.staffId;
  const price = service.price;
  const duration = service.duration;

  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60000);

  const existingBooking = await this.bookingModel.findOne({
    staffId,
    status: { $ne: 'cancelled' },
    startTime: { $lt: end },
    endTime: { $gt: start },
  });

  if (existingBooking) {
    throw new ConflictException('Staff already booked for this time');
  }

  const booking = await new this.bookingModel({
    customerId,
    serviceId,
    staffId,
    startTime: start,
    endTime: end,
    totalPrice: price,
    depositPaid: true,
    status: 'confirmed',
  }).save();

  const populated = await this.bookingModel
    .findById(booking._id)
    .populate('customerId', 'name email')
    .populate('serviceId', 'name duration price')
    .populate('staffId', 'name email')
    .exec();

  
  if (populated) {
    const customer = populated.customerId as any;
    const coach = populated.staffId as any;
    const serviceData = populated.serviceId as any;

    try {
      await this.mailService.sendBookingConfirmation(
        customer.email,
        customer.name,
        coach.email,
        coach.name,
        serviceData.name,
        booking.startTime,
        booking.totalPrice,
      );
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  }

  return populated || booking;
}
  async payDeposit(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid booking ID');

    const booking = await this.bookingModel
      .findById(id)
      .populate('customerId', 'name email')
      .populate('serviceId', 'name duration price')
      .populate('staffId', 'name email')
      .exec();

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.depositPaid) throw new ConflictException('Deposit already paid');

    booking.depositPaid = true;
    booking.status = 'confirmed';
    await booking.save();


    const customer = booking.customerId as any;
    const coach = booking.staffId as any;
    const service = booking.serviceId as any;

    try {
      await this.mailService.sendBookingConfirmation(
        customer.email,
        customer.name,
        coach.email,
        coach.name,
        service.name,
        booking.startTime,
        booking.totalPrice,
      );
    } catch (error) {
      
      console.error('Failed to send confirmation email:', error);
    }

    return booking;
  }

  async updateStatus(id: string, status: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid booking ID');
    const booking = await this.bookingModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async cancelBooking(id: string, userId: string, role: string) {
  if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid booking ID');

  const booking = await this.bookingModel
    .findById(id)
    .populate('customerId', 'name email')
    .populate('serviceId', 'name duration price')
    .populate('staffId', 'name email')
    .exec();

  if (!booking) throw new NotFoundException('Booking not found');
  if (booking.status === 'cancelled') throw new ConflictException('Booking already cancelled');
  if (booking.status === 'completed') throw new ForbiddenException('Cannot cancel a completed booking');


  const customerId = (booking.customerId as any)?.id?.toString() || booking.customerId.toString();
  const staffId = (booking.staffId as any)?.id?.toString() || booking.staffId.toString();

  if (role === 'customer' && customerId !== userId) {
    throw new ForbiddenException('You can only cancel your own bookings');
  }
  if (role === 'coach' && staffId !== userId) {
    throw new ForbiddenException('You can only cancel bookings for your own services');
  }

  booking.status = 'cancelled';
  await booking.save();

  // Send cancellation email
  const customer = booking.customerId as any;
  const coach = booking.staffId as any;
  const service = booking.serviceId as any;

  try {
    await this.mailService.sendBookingCancellation(
      customer.email,
      customer.name,
      coach.email,
      coach.name,
      service.name,
      booking.startTime,
    );
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
  }

  return booking;
}
}