import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { SeedService } from '../seed/seed.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [SeedService],
})
export class HealthModule {}
