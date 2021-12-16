import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './contact.model';
import { ValidDto, EditDto } from './dto/index.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ContactService {
  constructor(@InjectModel('Contact') private readonly ContactModel: Model<Contact>, private jwtService: JwtService) {}

  currentTime = new Date();

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

  async editContact(id: string, dto: EditDto, req: any) {
    const contact = await this.ContactModel.findOne({ _id: id, createdBy: req.user.sub });

    // Avoid duplicate records
    if (!contact) throw new UnauthorizedException({ status: false, message: 'Contact  does not exist' });

    if (dto.name) {
      contact.name = dto.name;
    }
    if (dto.phoneNumber) {
      contact.phoneNumber = dto.phoneNumber;
    }

    contact.updatedAt = this.currentTime;
    const updatedContact = await contact.save();

    return { status: true, message: 'Contact update was successful', updatedContact };
  }

  async deleteContact(id: string) {
    await this.ContactModel.findByIdAndDelete(id);
    return { status: true, message: 'Contact deleted successfully' };
  }

  async getAllContacts() {
    let contacts = await this.ContactModel.find();
    return { status: true, message: 'Contacts retrieved successfully', contacts };
  }

  async getSingleContact(id: string) {
    let contact = await this.ContactModel.findById(id);
    return { status: true, message: 'Contacts retrieved successfully', contact };
  }
}
