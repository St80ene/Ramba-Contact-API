import { Body, Controller, Get, Post, Patch, Req, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContactService } from './contacts.service';
import { ValidDto } from './dto/index.dto';

@Controller('api/contact')

export class ContactController{
  constructor(private readonly contactService: ContactService){}


  // Add a contact to
  @UseGuards(AuthGuard('jwt'))
  @Post()
  addUp(@Body() dto:ValidDto, @Req() req:any):any{
    
    return this.contactService.addContact(dto, req);
  }
}