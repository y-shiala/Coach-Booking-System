import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {

  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @UseGuards(JwtAuthGuard) 
  @Post()
 create(@Body() dto: CreateBookingDto, @Req() req) {
  return this.bookingsService.create(dto, req.user.userId);
}

}