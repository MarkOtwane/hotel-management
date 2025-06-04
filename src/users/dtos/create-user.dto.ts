export class CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  roomNumber?: number;
}
