import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { Produto } from './produto.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('produtos')
export class ProdutoController {
  constructor(
    private readonly produtoService: ProdutoService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return { imageUrl };
  }

 @Post()
@UseInterceptors(FileInterceptor('file'))
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() createProdutoDto: CreateProdutoDto,
) {
  // Se veio arquivo, envia pro Cloudinary e pega URL
  if (file) {
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    createProdutoDto.imagens = [imageUrl]; // salva como array
  }

  return this.produtoService.create(createProdutoDto);
}


  @Get('categorias')
  async getCategorias() {
    return this.produtoService.getCategorias();
  }

  @Get()
  findAll() {
    return this.produtoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.produtoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() produto: Partial<Produto>) {
    return this.produtoService.update(id, produto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.produtoService.delete(id);
  }
}
