import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServicesService } from '../services/services.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private servicesService: ServicesService,
    private mailService: MailService, 
  ) {}

  async findAll() {
    return this.bookingModel
      .find()
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
}