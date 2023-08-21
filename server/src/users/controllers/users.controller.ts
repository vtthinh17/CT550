/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
// import { Request } from 'express';
import { UsersService } from '../services/users.service';
// import { User } from '../models/user.model';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from '../dto/user.dto';
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get('getUser/:id')
    getUser(@Param('id') id: string) {
        return this.userService.getUser(id);
    }
    @Get('getAll')
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.userService.login(loginUserDto)
    }

    @Delete('/:id')
    async delete(@Param('id') id: string) {
        await this.userService.deleteUser(id);
    }

    @Patch('/:id')
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.updateUser(updateUserDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }


}
