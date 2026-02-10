import type { StringValue } from 'ms';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        let expiresIn: number | StringValue = '24h';
        if (process.env.JWT_EXPIRATION) {
          const val = process.env.JWT_EXPIRATION;
          if (/^\d+$/.test(val)) {
            expiresIn = Number(val);
          } else {
            expiresIn = val as StringValue;
          }
        }
        return {
          secret: String(process.env.JWT_SECRET || 'your_jwt_secret_key'),
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
