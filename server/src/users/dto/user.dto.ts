import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  role: number;
  uv_address: string;
  uv_phone: string;
  uv_fullname: string;
  uv_major: string;
  com_name: string;
  com_location: string;
  com_phone: string;
}

export class UpdateUserDto {
  id: string;
  uv_address: string;
  uv_phone: string;
  uv_fullname: string;
  uv_major: string;
  com_name: string;
  com_location: string;
  com_phone: string;
}

export class LoginUserDto {
  username: string;
  password: string;
}
