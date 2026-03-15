import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {

  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,

    private servicesService: ServicesService
  ) {}

  async findAll() {
  return this.bookingModel.find().exec();
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

    

    const booking = new this.bookingModel({
      customerId,
      serviceId,
      staffId,
      startTime: start,
      endTime: end,
      totalPrice: price,
      status: 'pending',
    });

    return booking.save();
  }

}