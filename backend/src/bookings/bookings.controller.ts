import { Controller, Get, Post, Put, Body, Param, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pay-deposit')
  payDeposit(@Param('id') id: string) {
    return this.bookingsService.payDeposit(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.bookingsService.updateStatus(id, body.status);
  }
}