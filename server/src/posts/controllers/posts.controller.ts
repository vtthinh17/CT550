/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Query, Delete } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
// import { UsersService } from 'src/users/services/users.service';
import { CreatePostDto, ApplyJobDto, UpdatePostDto, AddInterviewDto } from '../dto/posts.dto';
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) { }
  @Get('getPost/:id')
  getPost(@Param('id') id: string) {
    return this.postService.getPost(id);
  }
  @Get('getAll')
  getAll() {
    return this.postService.getAllPosts();
  }
  @Delete('deletePost/:id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
  @Get('getCompanyPosts/:id')
  getCompanyPosts(@Param('id') id: string, @Query('currentPage') currentPage: number) {
    return this.postService.getCompanyPosts(currentPage,id);
  }
  @Get('getPostsStatus1')
  get1() {
    return this.postService.getPostStatus1();
  }
  @Get('getCompanyActivePosts/:id')
  getCompanyActivePosts(@Param('id') id: string,@Query('currentPage') currentPage: number ) {
    return this.postService.getCompanyActivePosts(currentPage,id);
  }

  @Get('getPostByFilter')
  getFilterPosts(@Query('currentPage') currentPage: number, @Query('workingType') workingType: string, @Query('expRequire') expRequire: string, @Query('educationRequire') educationRequire: string, @Query('province') province: string) {
    return this.postService.getPostByFilters(currentPage, workingType, educationRequire, expRequire, province);
  }
  @Get('getReferPostByFilter')
  getReferPostByFilter(@Query('currentReferPage') currentReferPage: number) {
    return this.postService.getReferPostByFilter(currentReferPage);
  }

  @Get('getSysTemPosts')
  getSysTemPosts(@Query('currentPage') currentPage: number) {
    return this.postService.getSysTemPosts(currentPage);
  }

  @Get('getReferPosts')
  getReferPosts(@Query('currentReferPage') currentReferPage: number) {
    return this.postService.getReferPosts(currentReferPage);
  }
  
  @Get('getAllDisplay')
  getAllDisplayPosts(@Param('currentPage') currentPage: number) {
      return this.postService.getAllDisplayPosts(currentPage);
  }
  @Get('isSubmit')
  isSubmit(@Param('postId') postId: string, @Param('userId') userId: string) {
    return this.postService.isSubmit(postId,userId);
  }
  @Get('getAppliedPost/:userId')
  getAppliedPost(@Param('userId') userId: string) {
    return this.postService.getAppliedPost(userId);
  }
  @Put('getOutDatePosts')
  getOutDatePosts() {
    return this.postService.getOutDatePosts();
  }
  @Post('create')
  async createPost(@Param('userId') userId: string,@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto)
  }
  @Put('changePostStatus/:id')
  async changePostStatus(@Param('id') id: string,@Body() updatePostDto: UpdatePostDto) {
    return this.postService.changePostStatus(id, updatePostDto)
  }
  @Put('applyJob/:id')
  async applyJob(@Body() applyJobDto: ApplyJobDto, @Param('id') id: string) {
    return this.postService.applyJob(applyJobDto,id)
  }
  @Put('addInterview/:postId')
  async addInterview(@Body() addInterviewDto: AddInterviewDto, @Param('postId') postId: string) {
    return this.postService.addInterview(addInterviewDto,postId)
  }

  @Put('editInterview/:postId')
  async editInterview(@Body() addInterviewDto: AddInterviewDto, @Param('postId') postId: string) {
    return this.postService.editInterview(addInterviewDto,postId)
  }
  @Put('removeInterview/:postId')
  async removeInterview(@Body() userId: string, @Param('postId') postId: string) {
    return this.postService.removeInterview(userId['candidateId'], postId)
  }
  @Put('updatePost/:id')
    async updatePost(@Body() updatePostDto: UpdatePostDto, @Param('id') id: string) {
        return await this.postService.updatePost(updatePostDto, id);
    }
}
