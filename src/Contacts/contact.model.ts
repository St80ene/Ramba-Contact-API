// import * as mongoose from 'mongoose';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document, Schema } from 'mongoose';

export const ContactSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdBy: {type: SchemaTypes.ObjectId, ref: 'User'},
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export class Contact {
  id: string;
  name: string;
  phoneNumber: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
