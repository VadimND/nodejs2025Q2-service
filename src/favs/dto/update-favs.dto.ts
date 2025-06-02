import { PartialType } from '@nestjs/swagger';
import { CreateFavsDto } from './create-favs.dto';

export class UpdateFavsDto extends PartialType(CreateFavsDto) {}
