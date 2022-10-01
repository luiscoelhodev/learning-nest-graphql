import { Controller, Get, Post, Body, Patch, Param, Delete, Put, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('new')
  async create(@Body() data: Prisma.UserCreateInput) {
    return await this.usersService.create(data)
  }

  @Get('all')
  async getAll() {
    return { users: await this.usersService.getAll() }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.usersService.getOne(id)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    if (Object.keys(data).length === 0) return new BadRequestException('No body was provided!');
    return await this.usersService.update(id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id)
  }
}
