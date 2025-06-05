import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './interfaces/user.interface';
import { ApiResponse } from './shared/interfaces/api-response/api-response.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Register a new hoel guest
   * POST /users
   * Body{ 'name', 'email', phone}
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateUserDto): ApiResponse<User> {
    try {
      const user = this.usersService.create(data);
      return {
        success: true,
        message: 'Guest registered successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to register guest',
        error: error instanceof Error ? error.message : 'unknown error',
      };
    }
  }

  /**
   * Get all hotel guests
   * GET /users?active=true
   */
  findAll(@Query('active') active?: string): ApiResponse<User[]> {
    try {
      let users: User[];

      if (active === 'active') {
        users = this.usersService.findActive();
      } else {
        users = this.usersService.findAll();
      }

      return {
        success: true,
        message: `REtrived ${users.length} guests`,
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retreive guest',
        error: error instanceof Error ? error.message : 'unknown Error',
      };
    }
  }

  /**
   * Get user by id
   * GET /users/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ApiResponse<User> {
    try {
      const user = this.usersService.findOne(id);
      return {
        success: true,
        message: 'Guest found',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Guest not found',
        error: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  /**
   * Find guest by email
   * GET /users/email/:email
   */
  @Get('email/:email')
  findByEmail(@Param('email') email: string): ApiResponse<User> {
    try {
      const user = this.usersService.findByEmail(email);
      return {
        success: true,
        message: 'Guest By email found',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Guest with email not found',
        error: error instanceof Error ? error.message : 'unknown Error',
      };
    }
  }
}
