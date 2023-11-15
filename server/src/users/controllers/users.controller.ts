/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Delete, Param, Put, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
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
    @Get('getTodayCreatedAccount')
    gettoday() {
        return this.userService.getTodayCreatedAccount();
    }
    @Get('getAllCompanies')
    getAllCompanies(@Query('currentPage') currentPage: number) {
        return this.userService.getAllCompanies(currentPage);
    }
    @Get('getAll')
    getAll() {
      return this.userService.getAllUsers();
    }
    @Get('getAllCandidates')
    getCandidates(@Query('currentPage') currentPage: number,@Query('gender') gender: number,  @Query('educationRequire') educationRequire: string, @Query('province') province: string) {
        return this.userService.getAllCandidates(currentPage, gender, educationRequire, province);
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

    @Put('incre/:id')
    async incr(@Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.increaseTotalDisplayPost(id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }

    @Put('decre/:id')
    async decr(@Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.decreaseTotalDisplayPost(id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }

    @Put('insertCV/:id')
    async insertCV(@Body() insertCVDto: InsertCVDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.insertCV(insertCVDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }
    @Put('insertEducation/:id')
    async insertEdu(@Body() insertCVDto: InsertCVDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.insertEducation(insertCVDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }
    @Put('removeEducationInfo/:id')
    async removeEducationInfo(@Body() body: any, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.removeEducationInfo(id, body.eduId);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }
    @Put('removeDegreeInfo/:id')
    async removeDegreeInfo(@Body() body: any, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.removeDegreeInfo(id, body.deegreeId);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }
    
    @Put('insertDegree/:id')
    async insertDegree(@Body() insertCVDto: InsertCVDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.insertDegree(insertCVDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }
    @Put('changePassword/:id')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.userService.changePassword(changePasswordDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }

    @Put('unfollow/:userId')
    async unfollow(@Body() data: any, @Param('userId') userId: string) {
        return await this.userService.unfollow(userId, data.unfollowId);
    }

}
