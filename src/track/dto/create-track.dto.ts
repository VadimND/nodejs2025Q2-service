import {
  IsNotEmpty,
  IsString,
  ValidateIf,
  IsInt,
  IsDefined,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  @ValidateIf((_object, value) => value !== null)
  artistId: string | null; // refers to Artist

  @IsDefined()
  @IsString()
  @ValidateIf((_object, value) => value !== null)
  albumId: string | null; // refers to Album

  @IsNotEmpty()
  @IsInt()
  duration: number;
}
