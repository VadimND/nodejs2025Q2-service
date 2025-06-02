import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { favs, tracks } from 'src/memdb/memdb';
import { v4 } from 'uuid';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    const { name, artistId, albumId, duration } = createTrackDto;
    const track = {
      id: v4(),
      name,
      artistId,
      albumId,
      duration,
    };
    tracks.push(track);

    return track;
  }

  findAll() {
    return tracks;
  }

  findOne(id: string) {
    const track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const { name, artistId, albumId, duration } = updateTrackDto;
    const track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    track.name = name;
    track.albumId = albumId;
    track.artistId = artistId;
    track.duration = duration;

    return track;
  }

  remove(id: string) {
    const index = tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    tracks.splice(index, 1);

    favs.tracks = favs.tracks.filter((trackId) => trackId !== id);
  }
}
