import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { ServicesModule } from '../services/services.module';
import { MailModule } from '../mail/mail.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema }
    ]),
    ServicesModule,
    MailModule, 
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}