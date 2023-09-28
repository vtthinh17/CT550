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
  com_logo: string;
  avatar: string;
  address: string;
  phone: string;
  fullName: string;
  major: string;
  about: string;
  exp: string;
  certificates: string;
  brief_intro: string;
  com_phone: string;
  com_location: string;
  com_name: string;
}

export class InsertCVDto {
  id: string;
  fullName: string;
  avatar: string;
  exp: string;
  brief_intro: string;
  education: string;
  major: string;
  address: string;
  phone: string;
  certificates: string;
}

export class LoginUserDto {
  username: string;
  password: string;
}

export class ChangePasswordDto {
  id: string;
  password: string;
}
