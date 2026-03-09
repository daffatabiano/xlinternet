// auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma:  PrismaService,
    private readonly jwt:     JwtService,
    private readonly config:  ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Email atau password salah');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Email atau password salah');

    await this.prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken:  this.jwt.sign(payload),
      refreshToken: this.jwt.sign(payload, { expiresIn: '30d' }),
      expiresIn:    604800, // 7 days in seconds
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwt.verify(token);
      const user = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });
      if (!user || !user.isActive) throw new UnauthorizedException();

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      return {
        accessToken:  this.jwt.sign(newPayload),
        refreshToken: this.jwt.sign(newPayload, { expiresIn: '30d' }),
        expiresIn:    604800,
      };
    } catch {
      throw new UnauthorizedException('Refresh token tidak valid');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.adminUser.findUnique({
      where:  { id: userId },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async register(name: string, email: string, password: string) {
    const existing = await this.prisma.adminUser.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.adminUser.create({
      data: { name, email, passwordHash, role: 'ADMIN' },
      select: { id: true, name: true, email: true, role: true },
    });
    return user;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Password lama salah');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.adminUser.update({ where: { id: userId }, data: { passwordHash } });
    return { message: 'Password berhasil diubah' };
  }
}
