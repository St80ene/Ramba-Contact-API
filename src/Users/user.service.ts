import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcryptjs');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>, private jwtService: JwtService) {}

  async signUp(dto: AuthDto) {
    // retrieve user
    let existingUser = await this.userModel.findOne({ email: dto.email });

    // hash user's password before saving in database
    if (existingUser) throw new UnauthorizedException({ status: false, message: 'User exists already' });

    const newUser = new this.userModel({ email: dto.email, password: dto.password, username: dto.username });

    const user = await newUser.save();

    return { status: true, message: 'User sign up successful', user};
  }

  async login(dto: AuthDto) {
    // retrieve user
    let existingUser = await this.userModel.findOne({ email: dto.email });

    // hash user's password before saving in database
    if (!existingUser) throw new UnauthorizedException('Invalid Credentials');

    // Check if valid password
    if (existingUser && existingUser.password === dto.password) {
      const token = this.signUserCredentials(
        existingUser.username,
        existingUser._id,
        existingUser.password,
        existingUser.email,
      );
      return { status: true, message: 'User sign in successful', user: existingUser, token };
    }
    return null;

    // Sign the payload to get the token
  }

  signUserCredentials(username: string, userId: string, password: string, email: string) {
    const payload = { username, sub: userId, email, password };
    return this.jwtService.sign(payload);
  }
}
