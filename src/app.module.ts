import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Users/user.module';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './Contacts/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://st80ene:etiene@cluster0.hyuym.mongodb.net/contact-api?retryWrites=true&w=majority',
    ),
    UserModule, ContactModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
