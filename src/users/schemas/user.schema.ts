import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  COACH = 'coach',
  CUSTOMER = 'customer',
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop()
  bio?: string;

  @Prop()
  photo_url?: string;

  @Prop()
  price_per_hour?: number;

  @Prop({ type: Map, of: [String] })
  availability?: Map<string, string[]>;
}

export const UserSchema = SchemaFactory.createForClass(User);