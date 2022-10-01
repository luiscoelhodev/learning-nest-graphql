import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {

    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (userAlreadyExists) throw new BadRequestException('User already exists!')

    let user: User 
    try {
      user = await this.prisma.user.create({ data })
    } catch (error) {
      return { message: 'Error in creating this user.', error }    
    }
    return user
  }

  async getAll() {
    try {
      return await this.prisma.user.findMany()
    } catch (error) {
      return new BadRequestException('Error in getting all users from DB', error)
    }
  }

  async getOne(id: string) {
    try {
      const user = await this.prisma.user.findFirstOrThrow({ where: { id }})
      return { user } 
    } catch (error) {
      return new NotFoundException('User not found.', error)
    }
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    try {
      await this.prisma.user.findFirstOrThrow({ where: { id } })
    } catch (error) {
      return new NotFoundException('User not found.', error)
    }

    try {
      await this.prisma.user.update({ where: { id }, data})
      return { message: 'User updated successfully!' }
    } catch (error) {
      return new BadRequestException('Error in updating this user.', error)
    }
  }

  async delete(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } })
    if (!user) throw new NotFoundException('User not found!')
    
    try {
      await this.prisma.user.delete({ where: { id }})
      return { message: 'User deleted successfully! '}
    } catch (error) {
      return new BadRequestException('Error in deleting this user', error)      
    }
  }

}
