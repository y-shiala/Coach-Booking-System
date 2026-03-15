import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {

  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

}