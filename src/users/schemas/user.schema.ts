import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../common/enums/user-role.enums';

export type UserDocument = User & Document;

@Schema({ 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id.toString(); 
      delete ret._id;
      delete ret.__v;
      delete ret.password; 
      return ret;
    }
  }
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, type: String })
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