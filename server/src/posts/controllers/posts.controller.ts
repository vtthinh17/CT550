/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/posts.dto';
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) { }
  @Get('getPost/:id')
  getPost(@Param('id') id: string) {
    return this.postService.getPost(id);
  }
  @Get('getCompanyPosts/:id')
  getCompanyPosts(@Param('id') id: string) {
    return this.postService.getCompanyPosts(id);
  }
  @Post('create')
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto)
  }
  @Put('hidePost/:id')
  async hidePost(@Param('id') id: string) {
    return this.postService.hidePost(id)
  }
}
