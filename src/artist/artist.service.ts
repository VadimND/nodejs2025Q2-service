import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = await this.prisma.artist.create({
      data: createArtistDto,
    });

    return newArtist;
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const { name, grammy } = updateArtistDto;
    if (!name) {
      throw new BadRequestException('Name are required');
    }
    if (grammy === undefined) {
      throw new BadRequestException('Grammy are required');
    }
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });

    return updatedArtist;
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    await this.prisma.artist.delete({ where: { id } });
  }
}
