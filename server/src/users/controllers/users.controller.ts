/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Delete, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { Request } from 'express';
import { UsersService } from '../services/users.service';
// import { User } from '../models/user.model';
import { CreateUserDto, UpdateUserDto, LoginUserDto, InsertCVDto, ChangePasswordDto } from '../dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express'
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
    @Get('getAllCompanies')
    getAllCompanies() {
        return this.userService.getAllCompanies();
    }
    @Get('getCandidates')
    getCandidates() {
        return this.userService.getCandidates();
    }

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.userService.login(loginUserDto)
    }

    @Post('uploadAvatar')
    @UseInterceptors(FileInterceptor('photo', { dest: './uploads' }))
    uploadSingle(@UploadedFile() file) {
        console.log(file);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string) {
        await this.userService.deleteUser(id);
    }

    @Put('update/:id')
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.updateUser(updateUserDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }
    @Put('updateCompany/:id')
    async updateCompany(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.updateCompany(updateUserDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }

    @Put('insertCV/:id')
    async insertCV(@Body() insertCVDto: InsertCVDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.insertCV(insertCVDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }

    @Put('changePassword/:id')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.changePassword(changePasswordDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }



}