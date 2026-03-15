import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  
  describe('validateUser()', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        _id: 'someId',
        email: 'john@test.com',
        password: await bcrypt.hash('Password1!', 10),
        role: 'customer',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('john@test.com', 'Password1!');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.validateUser('john@test.com', 'Password1!');
      expect(result).toBeNull();
    });

    it('should return null if password is wrong', async () => {
      const mockUser = {
        email: 'john@test.com',
        password: await bcrypt.hash('Password1!', 10),
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('john@test.com', 'WrongPassword!');
      expect(result).toBeNull();
    });
  });

  
  describe('register()', () => {
    it('should register a user and return access_token', async () => {
      mockUserModel.findOne.mockResolvedValue(null); 
      mockUserModel.create.mockResolvedValue({
        _id: 'someId',
        email: 'john@test.com',
        role: 'customer',
      });

      const result = await service.register({
        name: 'John',
        email: 'john@test.com',
        password: 'Password1!',
        role: 'customer' as any,
      });

      expect(result).toEqual({ access_token: 'mock_token' });
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: 'john@test.com' });

      await expect(
        service.register({
          name: 'John',
          email: 'john@test.com',
          password: 'Password1!',
          role: 'customer' as any,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  
  describe('login()', () => {
    it('should return access_token', async () => {
      const mockUser = {
        _id: 'someId',
        email: 'john@test.com',
        role: 'customer',
      };

      const result = await service.login(mockUser as any);
      expect(result).toEqual({ access_token: 'mock_token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });
});