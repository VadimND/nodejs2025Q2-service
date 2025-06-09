/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const favArtists = await this.prisma.artist.findMany({
      where: { favorite: true },
    });
    const favAlbums = await this.prisma.album.findMany({
      where: { favorite: true },
    });
    const favTracks = await this.prisma.track.findMany({
      where: { favorite: true },
    });
    return {
      artists: favArtists.map((obj) => {
        const { favorite, ...clear } = obj;
        return clear;
      }),
      albums: favAlbums.map((obj) => {
        const { favorite, ...clear } = obj;
        return clear;
      }),
      tracks: favTracks.map((obj) => {
        const { favorite, ...clear } = obj;
        return clear;
      }),
    };
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newTrack = await this.prisma.track.update({
      where: { id },
      data: { favorite: true },
    });
    return newTrack;
  }

  async removeTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id, favorite: true },
    });
    if (!track) {
      throw new HttpException('Track not found in Favorites', HttpStatus.NOT_FOUND);
    }
    await this.prisma.track.update({
      where: { id },
      data: { favorite: false },
    });
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return await this.prisma.album.update({
      where: { id },
      data: { favorite: true },
    });
  }

  async removeAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id, favorite: true },
    });
    if (!album) {
      throw new HttpException('Album not found in Favorites', HttpStatus.NOT_FOUND);
    }
    await this.prisma.album.update({
      where: { id },
      data: { favorite: false },
    });
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await this.prisma.artist.update({
      where: { id },
      data: { favorite: true },
    });
  }

  async removeArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id, favorite: true },
    });
    if (!artist) {
      throw new HttpException('Artist not found in Favorites', HttpStatus.NOT_FOUND);
    }
    await this.prisma.artist.update({
      where: { id },
      data: { favorite: false },
    });
  }
}
