import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  staffId: Types.ObjectId;

}



export const ServiceSchema = SchemaFactory.createForClass(Service);