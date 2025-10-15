// import { Injectable } from '@nestjs/common';
// import * as path from 'path';
// import * as fs from 'fs';

// @Injectable()
// export class ImagemService {
//   saveFile(file: Express.Multer.File) {
//     return { filename: file.filename, url: `/imagens/${file.filename}` };
//   }

//   getFilePath(filename: string): string | null {
//     const filePath = path.resolve('./uploads/' + filename);
//     return fs.existsSync(filePath) ? filePath : null;
//   }
// }
