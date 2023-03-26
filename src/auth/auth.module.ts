import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGurad } from './guards/roles.guard';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretKey123',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGurad],
  exports: [JwtStrategy, JwtAuthGuard, RolesGurad],
})
export class AuthModule {}
