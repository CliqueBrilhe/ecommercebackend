import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateCategoriaDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  nome: string;

  @IsOptional()
  @IsInt({ message: 'A ordem deve ser um número inteiro.' })
  ordem?: number;

  @IsOptional()
  @IsInt({ message: 'O ID do pai deve ser um número inteiro.' })
  parentId?: number;
}
