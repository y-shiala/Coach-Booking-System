import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already in use');

    const userData = {
      ...dto,
      availability: dto.availability
        ? new Map(Object.entries(dto.availability))
        : undefined,
    };

    return new this.userModel(userData).save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid user ID');
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid user ID');

    const updateData = {
      ...dto,
      availability: dto.availability
        ? new Map(Object.entries(dto.availability))
        : undefined,
    };

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid user ID');
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('User not found');
    return { deleted: true };
  }
}