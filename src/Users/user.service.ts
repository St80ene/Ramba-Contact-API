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

    let hashedPassword = await bcrypt.hash(dto.password, 20);

    const newUser = new this.userModel({ email: dto.email, password: hashedPassword, username: dto.username });

    const user = await newUser.save();

    return user;
  }

  async login(dto: AuthDto) {
    // retrieve user
    let existingUser = await this.userModel.findOne({ email: dto.email });

    // hash user's password before saving in database
    if (!existingUser) throw new UnauthorizedException('Invalid Credentials');

    // Check if valid password
    if (existingUser) {
      const match = await bcrypt.compare(dto.password, existingUser.password);
      if (!match) throw new UnauthorizedException({ status: false, message: 'Incorrect Credentials' });
    }

    // Sign the payload to get the token
    const token = this.signUserCredentials(existingUser.username, existingUser._id, existingUser.password, existingUser.email);
    return {user: existingUser, token}
  }

  signUserCredentials(username: string, userId: string, password: string, email: string) {
    const payload = { username, sub: userId, email, password };
    return this.jwtService.sign(payload);
  }
}
