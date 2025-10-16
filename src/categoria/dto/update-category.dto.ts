import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-category.dto';

// PartialType faz com que todos os campos de CreateCategoriaDto se tornem opcionais.
export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}
