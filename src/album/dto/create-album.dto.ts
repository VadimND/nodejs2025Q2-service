import { IsNotEmpty, IsString, IsInt, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsString()
  @ValidateIf((_object, value) => value !== null)
  artistId: string | null;
}
