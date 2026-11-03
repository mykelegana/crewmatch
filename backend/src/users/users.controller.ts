import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';

interface AuthenticatedRequest extends Request {
  user: { sub: string };
}

@Controller('auth')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@Req() request: AuthenticatedRequest) {
    return this.users.findPublicById(request.user.sub);
  }
}
