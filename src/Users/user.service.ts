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

    let hashedPassword = bcrypt.hashSync(dto.password, 20);

    const newUser = new this.userModel({ email: dto.email, password: hashedPassword, username: dto.username });

    const user = await newUser.save();

    return user;
  }

  async login(dto: AuthDto) {
    // retrieve user
    let existingUser = await this.userModel.findOne({ email: dto.email });

    // hash user's password before saving in database
    if (!existingUser) throw new UnauthorizedException('Invalid Credentials');

    // if (existingUser) {
    //   const match = bcrypt.compareSync(dto.password, existingUser.password);
    //   if (!match) throw new UnauthorizedException({ status: false, message: 'Incorrect Credentials' });
    // }

    return this.signUserCredentials(existingUser.username, existingUser._id, existingUser.password, existingUser.email);
  }

  signUserCredentials(username: string, userId: string, password: string, email: string) {
    const payload = { username, sub: userId, email, password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
