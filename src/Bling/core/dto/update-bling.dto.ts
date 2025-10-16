import { PartialType } from '@nestjs/mapped-types';
import { CreateBlingDto } from './create-bling.dto';

export class UpdateBlingDto extends PartialType(CreateBlingDto) {}
