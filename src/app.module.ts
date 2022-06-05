import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttachmentController } from './controllers/attachment/attachment.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [AppController, AttachmentController],
  providers: [AppService],
})
export class AppModule {}
