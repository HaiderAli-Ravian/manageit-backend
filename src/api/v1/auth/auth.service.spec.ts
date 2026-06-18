import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Role } from '../../../common/enums/role.enum';

const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  createUser: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mocked.token'),
};

const jwtConfig: Record<string, string> = {
  JWT_ACCESS_SECRET: 'test-access-secret',
  JWT_ACCESS_EXPIRES_IN: '15m',
  JWT_REFRESH_SECRET: 'test-refresh-secret',
  JWT_REFRESH_EXPIRES_IN: '7d',
};

const mockConfigService = {
  get: jest.fn((key: string) => jwtConfig[key]),
  getOrThrow: jest.fn((key: string) => jwtConfig[key]),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('signup hashes the password before storing', async () => {
    expect.assertions(2);

    let capturedData: { email: string; passwordHash: string; name: string };
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.createUser.mockImplementation(async (data) => {
      capturedData = data;
      return {
        id: 'uuid-1',
        email: data.email,
        name: data.name,
        role: Role.USER,
      };
    });

    await service.signup({
      email: 'user@test.com',
      password: 'plaintext123',
      name: 'Test User',
    });

    expect(capturedData!.passwordHash).not.toBe('plaintext123');
    expect(
      await bcrypt.compare('plaintext123', capturedData!.passwordHash),
    ).toBe(true);
  });

  it('signup with duplicate email throws ConflictException with EMAIL_TAKEN code', async () => {
    expect.assertions(2);

    mockUsersService.findByEmail.mockResolvedValue({
      id: 'uuid-1',
      email: 'taken@test.com',
    });

    await service
      .signup({ email: 'taken@test.com', password: 'Pass1234!', name: 'Test' })
      .catch((err: ConflictException) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect((err.getResponse() as Record<string, unknown>).code).toBe(
          'EMAIL_TAKEN',
        );
      });
  });

  it('login with wrong password throws UnauthorizedException', async () => {
    const passwordHash = await bcrypt.hash('correctPassword', 10);
    mockUsersService.findByEmail.mockResolvedValue({
      id: 'uuid-1',
      email: 'user@test.com',
      passwordHash,
      role: Role.USER,
    });

    await expect(
      service.login({ email: 'user@test.com', password: 'wrongPassword' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
