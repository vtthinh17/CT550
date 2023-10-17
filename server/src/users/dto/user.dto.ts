import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  role: number;
  // uv_address: string;
  // uv_phone: string;
  // uv_fullname: string;
  com_name: string;
  com_location: string;
  com_phone: string;
  taxNumber: string;
  cv: {
    education: [];
    degreeList: [];
  };
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
  brief_intro: string;
  graded: string;
  province: string;
  school: string;
  start: string;
  end: string;
  sex: string;
  level: string;
  birthday: string;
  certificates: string;
  com_phone: string;
  com_location: string;
  com_name: string;
  degreeName: string;
  result: string;
}

export class InsertCVDto {
  id: string;
  fullName: string;
  avatar: string;
  exp: string;
  brief_intro: string;
  graded: string;
  province: string;
  school: string;
  major: string;
  start: string;
  end: string;
  sex: string;
  level: string;
  birthday: string;
  address: string;
  phone: string;
  certificates: string;
  degreeName: string;
  result: string;
}

export class LoginUserDto {
  username: string;
  password: string;
}

export class ChangePasswordDto {
  id: string;
  password: string;
}
