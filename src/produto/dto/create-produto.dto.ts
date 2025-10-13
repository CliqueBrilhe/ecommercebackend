  // src/produto/dto/create-produto.dto.ts
  import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

  export class CreateProdutoDto {
    @IsString()
    codigo: string;

    @IsString()
    nome: string;

    @IsNumber()
    quantidadeEstoque: number;

    @IsNumber()
    preco: number;

    @IsOptional()
    @IsNumber()
    promocao?: number;

    @IsNumber()
    largura: number;

    @IsNumber()
    altura: number;

    @IsNumber()
    profundidade: number;

    @IsArray()
    imagens: string[];

    @IsString()
    descricao: string;

    @IsNumber()
    categoriaId: number;
  }
