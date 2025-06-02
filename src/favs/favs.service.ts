import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { favs, artists, albums, tracks } from 'src/memdb/memdb';

@Injectable()
export class FavsService {
  findAll() {
    const favArtists = favs.artists.map((id) =>
      artists.find((artist) => artist.id === id),
    );
    const favAlbums = favs.albums.map((id) =>
      albums.find((album) => album.id === id),
    );
    const favTracks = favs.tracks.map((id) =>
      tracks.find((track) => track.id === id),
    );

    return {
      artists: favArtists,
      albums: favAlbums,
      tracks: favTracks,
    };
  }

  addTrack(id: string) {
    const track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favs.tracks.push(track.id);
    return track;
  }

  removeTrack(id: string) {
    const index = favs.tracks.indexOf(id);

    if (index === -1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    favs.tracks.splice(index, 1);
  }

  addAlbum(id: string) {
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favs.albums.push(album.id);
    return album;
  }

  removeAlbum(id: string) {
    const index = favs.albums.indexOf(id);

    if (index === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    favs.albums.splice(index, 1);
  }

  addArtist(id: string) {
    const artist = artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favs.artists.push(artist.id);
    return artist;
  }

  removeArtist(id: string) {
    const index = favs.artists.indexOf(id);
    if (index === -1) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    favs.artists.splice(index, 1);
  }
}
