import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductImagesController } from './product-images.controller';
import { ProductImagesService } from './product-images.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: './public/images/productos',
    }),
  ],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
