import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './contact.model';
import { ValidDto } from './dto/index.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ContactService {
  constructor(@InjectModel('Contact') private readonly ContactModel: Model<Contact>, private jwtService: JwtService) {}

  async addContact(dto: ValidDto, req: any) {
    try {
      // retrieve Contact
      let existingContact = await this.ContactModel.findOne({ phoneNumber: dto.phoneNumber });

      // Avoid duplicate records
      if (existingContact) throw new UnauthorizedException({ status: false, message: 'Contact exists already' });

      // Saved contact to DB
      const contact = await this.ContactModel.create({
        phoneNumber: dto.phoneNumber,
        name: dto.name,
        createdBy: req.user.sub,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { status: true, message: 'Contact saved successfully', contact };
    } catch (error) {
      return error.message;
    }
  }
}
