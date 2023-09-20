/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { UsersService } from 'src/users/services/users.service';
import { CreatePostDto, ApplyJobDto } from '../dto/posts.dto';
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
  getFilterPosts(@Query('working_type') working_type: string,) {
    return this.postService.getPostByFilters(working_type);
  }
  @Get('getAllDisplay')
  getAllDisplayPosts() {
      return this.postService.getAllDisplayPosts();
  }
  @Get('isSubmit')
  isSubmit(@Param('postId') postId: string, @Param('userId') userId: string) {
    return this.postService.isSubmit(postId,userId);
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
}
