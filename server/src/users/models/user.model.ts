import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, required: true },
});
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type UserDocument = User & Document;

// @Schema()
// export class User {
//   @Prop()
//   username: string;

//   @Prop()
//   password: string;

//   @Prop()
//   createdAt: string;
// }

// export const UserSchema = SchemaFactory.createForClass(User);
