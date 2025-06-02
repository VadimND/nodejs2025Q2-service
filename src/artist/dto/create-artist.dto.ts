import { IsNotEmpty, IsString, IsDefined, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsBoolean()
  grammy: boolean;
}
