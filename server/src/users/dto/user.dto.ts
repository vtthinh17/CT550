export class CreateUserDto {
  username: string;
  password: string;
}

export class UpdateUserDto {
  id: string;
  username: string;
  password: string;
}

export class LoginUserDto {
  username: string;
  password: string;
}
