import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  staffId: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: false })
  depositPaid: boolean;

  @Prop({
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);