import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { ContactSchema } from './contact.model';
import { ContactService } from './contacts.service';
import { jwtConstants } from '../strategy/jwt.constants';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({ secret: jwtConstants.secret }),
    MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }]),
  ],
  controllers: [ContactController],
  providers: [ContactService, JwtStrategy],
})
export class ContactModule {}
