import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUserModel = {
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  
  describe('create()', () => {
    it('should create a user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(null); 

      const saveMock = jest.fn().mockResolvedValue({
        _id: 'someId',
        name: 'John',
        email: 'john@test.com',
        role: 'customer',
      });

      service['userModel'] = jest.fn().mockImplementation(() => ({
        save: saveMock,
      })) as any;

     
      (service['userModel'] as any).findOne = mockUserModel.findOne;

      const result = await service.create({
        name: 'John',
        email: 'john@test.com',
        password: 'Password1!',
        role: 'customer' as any,
      });

      expect(result.email).toBe('john@test.com');
      expect(saveMock).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: 'john@test.com' });

      await expect(
        service.create({
          name: 'John',
          email: 'john@test.com',
          password: 'Password1!',
          role: 'customer' as any,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  
  describe('findOne()', () => {
    it('should return a user if found', async () => {
      const mockUser = { _id: '648a1f2e3b4c5d6e7f8a9b0c', name: 'John' };
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne('648a1f2e3b4c5d6e7f8a9b0c');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException for invalid ID', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findOne('648a1f2e3b4c5d6e7f8a9b0c'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  
  describe('remove()', () => {
    it('should delete a user successfully', async () => {
      mockUserModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      const result = await service.remove('648a1f2e3b4c5d6e7f8a9b0c');
      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(
        service.remove('648a1f2e3b4c5d6e7f8a9b0c'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});