import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const { name, grammy } = updateArtistDto;
    if (!name) {
      throw new HttpException('Name are required', HttpStatus.BAD_REQUEST);
    }
    if (grammy === undefined) {
      throw new HttpException('Grammy are required', HttpStatus.BAD_REQUEST);
    }
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
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
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.artist.delete({ where: { id } });
  }
}
