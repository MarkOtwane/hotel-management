import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './interfaces/user.interface';
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
  /**
   * @return User[]
   */
  findAll(): User[] {
    return this.users;
  }

  /**
   * Get active hotel guest
   * @return User[]
   */
  findActive(): User[] {
    return this.users.filter((user) => user.isActive);
  }

  /**
   * Find by Id
   * @param id
   * @return User
   */
  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`Guest with id ${id} not found `);
    }
    return user;
  }

  /**
   * Find guest by email
   * @param email
   * @return User
   */
  findByEmail(email: string): User {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      throw new NotFoundException(`Guest with email ${email} not found`);
    }
    return user;
  }

  /**
   * update guest profile
   * @param id, updateUserDto
   * @return User
   */
  update(id: number, data: UpdateUserDto): User {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === 1) {
      throw new NotFoundException(`Guest with id ${id} not found`);
    }

    if (data.email) {
      const existingUser = this.users.find(
        (user) => user.email === data.email && user.id !== id,
      );

      if (existingUser) {
        throw new ConflictException('Another guest with this id exists');
      }
    }
    if (data.checkInDate && data.checkOutDate) {
      if (new Date(data.checkInDate) >= new Date(data.checkOutDate)) {
        throw new ConflictException(
          'Check out date must be before check in date',
        );
      }
    }
    const updatedUser = {
      ...this.users[userIndex],
      data,
      checkInDate: data.checkInDate
        ? new Date(data.checkInDate)
        : this.users[userIndex].checkInDate,
      checkOutDate: data.checkOutDate
        ? new Date(data.checkOutDate)
        : this.users[userIndex].checkOutDate,
      updatedAt: new Date(),
    };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * soft delete
   * @param id
   * @return message: string
   */
  remove(id: number): { message: string } {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === 1) {
      throw new NotFoundException(`Guest with id ${id} not found`);
    }

    this.users[userIndex].isActive = false;
    this.users[userIndex].updatedAt = new Date();

    return {
      message: `Guest ${this.users[userIndex].name} has checked out successfully`,
    };
  }
  /**
   * Hard delete {remove from array completely}
   * @param id: number
   * @return message: string
   */
  delete(id: number): { message: string } {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === 1) {
      throw new NotFoundException(`Guest with id ${id} not found`);
    }
    const deleteUser = this.users.splice(userIndex, 1)[0];

    return {
      message: `Guest ${deleteUser.name} permanently deleted`,
    };
  }
}
