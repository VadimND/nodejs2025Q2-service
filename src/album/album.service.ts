import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data: createAlbumDto,
    });

    return newAlbum;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { name, year, artistId } = updateAlbumDto;
    if (!name) {
      throw new BadRequestException('Name are required');
    }
    if (!year) {
      throw new BadRequestException('Year are required');
    }
    if (artistId === undefined) {
      throw new BadRequestException('Artist are required');
    }
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: updateAlbumDto,
    });

    return updatedAlbum;
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.prisma.album.delete({ where: { id } });
  }
}
