/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { UsersService } from 'src/users/services/users.service';
import { CreatePostDto, ApplyJobDto, UpdatePostDto } from '../dto/posts.dto';
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService,private readonly userService: UsersService) { }
  @Get('getPost/:id')
  getPost(@Param('id') id: string) {
    return this.postService.getPost(id);
  }
  @Get('getCompanyPosts/:id')
  getCompanyPosts(@Param('id') id: string) {
    return this.postService.getCompanyPosts(id);
  }
  @Get('getPostByFilter')
  getFilterPosts(@Query('currentPage') currentPage: number, @Query('workingType') workingType: string, @Query('expPrequire') expPrequire: string, @Query('educationPrequire') educationPrequire: string, @Query('major') major: string,) {
    return this.postService.getPostByFilters(currentPage, workingType, educationPrequire, expPrequire, major);
  }
  @Get('getAllDisplay')
  getAllDisplayPosts(@Param('currentPage') currentPage: number) {
      return this.postService.getAllDisplayPosts(currentPage);
  }
  @Get('isSubmit')
  isSubmit(@Param('postId') postId: string, @Param('userId') userId: string) {
    return this.postService.isSubmit(postId,userId);
  }
  @Put('getOutDatePosts')
  getOutDatePosts() {
    return this.postService.getOutDatePosts();
  }
  @Post('create')
  async createPost(@Param('userId') userId: string,@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto)
  }
  @Put('hidePost/:id')
  async hidePost(@Param('id') id: string) {
    return this.postService.hidePost(id)
  }
  @Put('applyJob/:id')
  async applyJob(@Body() applyJobDto: ApplyJobDto, @Param('id') id: string) {
    return this.postService.applyJob(applyJobDto,id)
  }
  @Put('updatePost/:id')
    async updatePost(@Body() updatePostDto: UpdatePostDto, @Param('id') id: string) {
        // const user = await this.userService.getUser(id);
        return await this.postService.updatePost(updatePostDto, id);
        // throw new HttpException(NOT_ALLOWED_USER_MESSAGE, HttpStatus.FORBIDDEN);
    }
}
