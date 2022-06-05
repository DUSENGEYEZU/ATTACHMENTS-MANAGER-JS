import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('Attachment')
@Controller('attachment')
export class AttachmentController {

    @ApiOperation({ summary: "Upload file" })
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
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        return { status: true, message: 'File uploaded successfully!', url: `${process.env.SERVER_DOMAIN}/attachment/path/${file.filename}`}
    }


    @Get('/path/:filename')
    getFile(
        @Param('filename') filename: string,
        @Res() res: Response
    ) {
        const file = createReadStream(join(process.cwd(), `uploads/${filename}`));
        file.pipe(res)
    }

}
