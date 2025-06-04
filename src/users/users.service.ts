import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Joe',
      email: 'joe@gmail.com',
      phone: '+2541234567',
      checkInDate: new Date('2025-08-06'),
      checkOutDate: new Date('2025-06-12'),
      roomNumber: 101,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Kelvin',
      email: 'joe123@gmail.com',
      phone: '+254123450067',
      checkInDate: new Date('2025-08-06'),
      checkOutDate: new Date('2025-06-12'),
      roomNumber: 1027,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // next id
  private nextId = 3;

  create(data: CreateUserDto): User {
    const existingUser = this.users.find((user) => user.email === data.email);

    if (existingUser) {
      throw new ConflictException(
        `Guest with email${data.email} already exist`,
      );
    }

    if (data.checkInDate && data.checkOutDate) {
      if (new Date(data.checkInDate) >= new Date(data.checkOutDate)) {
        throw new ConflictException(
          'Check out date must be before check in date',
        );
      }
    }

    const newUser: User = {
      id: this.nextId++,
      ...data,
      checkInDate: data.checkInDate ? new Date(data.checkInDate) : undefined,
      checkOutDate: data.checkOutDate ? new Date(data.checkOutDate) : undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }
}
