import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDto } from './dto/auth.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Sign Up A User
  @Post('signup')
  signUp(
    @Body() dto: AuthDto,
  ): any {
    return this.userService.signUp(dto);
  }

  // Sign A User in
  @Post('sign-in')
  signIn(@Body() dto: AuthDto): any {
    return this.userService.login(dto);
  }
}
