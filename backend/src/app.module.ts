import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfServiceController } from './modules/pdf-service/pdf-service.controller';
import { PdfServiceService } from './modules/pdf-service/pdf-service.service';

@Module({
  imports: [],
  controllers: [AppController, PdfServiceController],
  providers: [AppService, PdfServiceService],
})
export class AppModule {}
