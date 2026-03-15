import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

import { Booking, BookingSchema } from './schemas/booking.schema';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema }
    ]), ServicesModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}