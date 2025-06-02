import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Favs } from '../favs/entities/favs.entity';

export const users: User[] = [];
export const artists: Artist[] = [];
export const albums: Album[] = [];
export const tracks: Track[] = [];
export const favs: Favs = {
  artists: [],
  albums: [],
  tracks: [],
};
