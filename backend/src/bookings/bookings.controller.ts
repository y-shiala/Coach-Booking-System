import { Controller, Get, Post, Put, Body, Param, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

 @UseGuards(JwtAuthGuard)
 @Get()
 findAll(@Req() req) {
  return this.bookingsService.findAll(req.user.userId, req.user.role);
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
  updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Req() req) {
    if (req.user.role !== 'coach') {
    throw new ForbiddenException('Only coaches can update booking status');
  }
    return this.bookingsService.updateStatus(id, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/cancel')
  cancelBooking(@Param('id') id: string, @Req() req) {
    return this.bookingsService.cancelBooking(id, req.user.userId, req.user.role);
}
}