import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  
  describe('register()', () => {
    it('should register a user and return access_token', async () => {
      const mockDto = {
        name: 'John',
        email: 'john@test.com',
        password: 'Password1!',
        role: 'customer' as any,
      };

      mockAuthService.register.mockResolvedValue({ access_token: 'mock_token' });

      const result = await controller.register(mockDto);
      expect(result).toEqual({ access_token: 'mock_token' });
      expect(mockAuthService.register).toHaveBeenCalledWith(mockDto);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockAuthService.register.mockRejectedValue(
        new ConflictException('Email already in use'),
      );

      await expect(
        controller.register({
          name: 'John',
          email: 'john@test.com',
          password: 'Password1!',
          role: 'customer' as any,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  
  describe('login()', () => {
    it('should login and return access_token', async () => {
     
      const mockReq = {
        user: {
          _id: 'someId',
          email: 'john@test.com',
          role: 'customer',
        },
      };

      mockAuthService.login.mockResolvedValue({ access_token: 'mock_token' });

      const result = await controller.login(mockReq);
      expect(result).toEqual({ access_token: 'mock_token' });
      expect(mockAuthService.login).toHaveBeenCalledWith(mockReq.user);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const mockReq = { user: null };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(mockReq)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});