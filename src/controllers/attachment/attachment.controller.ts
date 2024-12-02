// import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { Response, Request } from 'express';
// import { createReadStream } from 'fs';
// import { join } from 'path';

// @ApiTags('Attachment')
// @Controller('attachment')
// export class AttachmentController {

//     @ApiOperation({ summary: "Upload file" })
//     @ApiConsumes('multipart/form-data')
//     @ApiBody({
//         schema: {
//             type: 'object',
//             properties: {
//                 kind: { type: 'string' },
//                 unique_reference: { type: 'string' },
//                 file: {
//                     type: 'string',
//                     format: 'binary',
//                 },
//             },
//         },
//     })
//     @Post('upload')
//     @UseInterceptors(FileInterceptor('file'))
//     uploadFile(@UploadedFile() file: Express.Multer.File) {
//         console.log(file);
//         return { status: true, message: 'File uploaded successfully!', url: `${process.env.SERVER_DOMAIN}/attachment/path/${file.filename}`}
//     }


//     @Get('/path/:filename')
//     getFile(
//         @Param('filename') filename: string,
//         @Res() res: Response
//     ) {
//         const file = createReadStream(join(process.cwd(), `uploads/${filename}`));
//         file.pipe(res)
//     }

// }

import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join, extname } from 'path';
import { diskStorage } from 'multer';

@ApiTags('Attachment')
@Controller('attachment')
export class AttachmentController {
  // Upload file endpoint
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        kind: { type: 'string' },
        unique_reference: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
@Post('upload')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Save files in 'uploads' directory
      filename: (req, file, callback) => {
        // Use the original filename provided by the user
        callback(null, file.originalname);
      },
    }),
  }),
)
uploadFile(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    return { status: false, message: 'File upload failed!' };
  }
  return {
    status: true,
    message: 'File uploaded successfully!',
    url: `${process.env.SERVER_DOMAIN}/attachment/path/${file.filename}`,
  };
}

  // Serve file endpoint
  @ApiOperation({ summary: 'Get file by filename' })
  @Get('/path/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), `uploads/${filename}`);
    if (!existsSync(filePath)) {
      return res.status(404).json({ status: false, message: 'File not found!' });
    }

    const fileStream = createReadStream(filePath);
    fileStream.on('error', (err) => {
      res.status(500).json({ status: false, message: 'Error reading file' });
    });

    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'application/octet-stream',
    });
    fileStream.pipe(res);
  }
}

