import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { ImagemService } from './imagem.service';
import type { Express } from 'express';

@Controller('imagens')
export class ImagemController {
  constructor(private readonly imagemService: ImagemService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.imagemService.saveFile(file);
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.imagemService.getFilePath(filename);
    if (filePath) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('Arquivo não encontrado');
    }
  }
  @Post('upload-multiplas')
    @UseInterceptors(FilesInterceptor('imagens', 5, { dest: './uploads' }))
    uploadMultiplas(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => ({
        filename: file.filename,
        path: file.path,
    }))
    }

}
