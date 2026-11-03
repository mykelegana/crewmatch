import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({ compare: jest.fn() }));
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  const prisma = { user: { findUnique: jest.fn() } };
  const jwt = { signAsync: jest.fn() };
  const service = new AuthService(prisma as never, jwt as never);

  beforeEach(() => jest.clearAllMocks());

  it('returns an access token and public user for valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-id', email: 'boss@crewmatch.ph', name: 'Boss', passwordHash: 'hash',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwt.signAsync.mockResolvedValue('token');

    await expect(service.login({ email: 'BOSS@CREWMATCH.PH', password: 'password123' }))
      .resolves.toEqual({
        accessToken: 'token',
        user: { id: 'user-id', email: 'boss@crewmatch.ph', name: 'Boss' },
      });
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: 'user-id', email: 'boss@crewmatch.ph', name: 'Boss',
    });
  });

  it('rejects invalid credentials without exposing password data', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'unknown@example.com', password: 'password123' }))
      .rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });
});
