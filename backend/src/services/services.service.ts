import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name)
    private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(dto: CreateServiceDto, userId: string): Promise<Service> {
   
    const service = new this.serviceModel({
      ...dto,
      staffId: userId,
    });
    return service.save();
  }

  async findAll() {
    return this.serviceModel
      .find()
      .populate('staffId', 'name email bio price_per_hour availability')
      .exec();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid service ID');
    const service = await this.serviceModel
      .findById(id)
      .populate('staffId', 'name email bio price_per_hour availability')
      .exec();
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: string, dto: UpdateServiceDto, userId: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid service ID');

    const service = await this.serviceModel.findById(id).exec();
    if (!service) throw new NotFoundException('Service not found');

    
    if (service.staffId.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own services');
    }

    return this.serviceModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }

  async remove(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid service ID');

    const service = await this.serviceModel.findById(id).exec();
    if (!service) throw new NotFoundException('Service not found');

    if (service.staffId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    await this.serviceModel.deleteOne({ _id: id }).exec();
    return { deleted: true };
  }
}