import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  } })
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
    default: 'confirmed',
  })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);