import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    const track = await this.prisma.track.create({
      data: createTrackDto,
    });

    return track;
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });

    return updatedTrack;
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    await this.prisma.track.delete({ where: { id } });
  }
}
