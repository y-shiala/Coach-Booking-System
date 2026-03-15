import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {

  constructor(
    @InjectModel(Service.name)
    private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(dto: CreateServiceDto) {
    const service = new this.serviceModel(dto);
    return service.save();
  }

  async findAll() {
  return this.serviceModel.find().exec();
}

  async findById(id: string) {
  if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid service ID');
  const service = await this.serviceModel.findById(id).exec();
  if (!service) throw new NotFoundException('Service not found');
  return service;
}

}