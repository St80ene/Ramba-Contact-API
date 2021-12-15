import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }, 
  email: { type: String, required: true },
});

export class User {
  id: string;
  username: string;
  password: string;
  email: string;
}