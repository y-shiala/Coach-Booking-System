import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => jest.clearAllMocks());


  describe('create()', () => {
    it('should create a user and return it', async () => {
      const mockDto = {
        name: 'John',
        email: 'john@test.com',
        password: 'Password1!',
        role: 'customer' as any,
      };

      const mockUser = { _id: 'someId', ...mockDto };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(mockDto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(mockDto);
    });

    it('should throw ConflictException if email exists', async () => {
      mockUsersService.create.mockRejectedValue(
        new ConflictException('Email already in use'),
      );

      await expect(
        controller.create({
          name: 'John',
          email: 'john@test.com',
          password: 'Password1!',
          role: 'customer' as any,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  
  describe('findAll()', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: 'user1', name: 'John' },
        { _id: 'user2', name: 'Jane' },
      ];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  
  describe('findOne()', () => {
    it('should return a user if found', async () => {
      const mockUser = { _id: '648a1f2e3b4c5d6e7f8a9b0c', name: 'John' };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('648a1f2e3b4c5d6e7f8a9b0c');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('648a1f2e3b4c5d6e7f8a9b0c');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.findOne('648a1f2e3b4c5d6e7f8a9b0c'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update and return the user', async () => {
      const mockUpdated = { _id: '648a1f2e3b4c5d6e7f8a9b0c', name: 'John Updated' };
      mockUsersService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update('648a1f2e3b4c5d6e7f8a9b0c', {
        name: 'John Updated',
      });

      expect(result).toEqual(mockUpdated);
      expect(mockUsersService.update).toHaveBeenCalledWith(
        '648a1f2e3b4c5d6e7f8a9b0c',
        { name: 'John Updated' },
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.update('648a1f2e3b4c5d6e7f8a9b0c', { name: 'John Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  
  describe('remove()', () => {
    it('should delete a user and return { deleted: true }', async () => {
      mockUsersService.remove.mockResolvedValue({ deleted: true });

      const result = await controller.remove('648a1f2e3b4c5d6e7f8a9b0c');
      expect(result).toEqual({ deleted: true });
      expect(mockUsersService.remove).toHaveBeenCalledWith('648a1f2e3b4c5d6e7f8a9b0c');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.remove.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.remove('648a1f2e3b4c5d6e7f8a9b0c'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});