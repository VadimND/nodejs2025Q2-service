import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 } from 'uuid';
import { albums, favs, tracks } from 'src/memdb/memdb';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    const newAlbum = {
      id: v4(),
      name,
      year,
      artistId,
    };

    albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return albums;
  }

  findOne(id: string) {
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { name, year, artistId } = updateAlbumDto;
    if (!name) {
      throw new HttpException('Name are required', HttpStatus.BAD_REQUEST);
    }
    if (!year) {
      throw new HttpException('Year are required', HttpStatus.BAD_REQUEST);
    }
    if (artistId === undefined) {
      throw new HttpException('Artist are required', HttpStatus.BAD_REQUEST);
    }
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    album.name = name;
    album.year = year;
    album.artistId = artistId;

    return album;
  }

  remove(id: string) {
    const index = albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    albums.splice(index, 1);

    tracks.map((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    favs.albums = favs.albums.filter((albumId) => albumId !== id);
  }
}
