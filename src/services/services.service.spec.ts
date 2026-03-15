import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { getModelToken } from '@nestjs/mongoose';
import { Service } from './schemas/service.schema';
import { NotFoundException } from '@nestjs/common';

const mockServiceModel = {
  find: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
};

describe('ServicesService', () => {
  let service: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: getModelToken(Service.name), useValue: mockServiceModel },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => jest.clearAllMocks());

  
  describe('create()', () => {
    it('should create a service successfully', async () => {
      const mockDto = {
        name: 'Haircut',
        description: 'A simple haircut',
        duration: 30,
        price: 20,
        staffId: '648a1f2e3b4c5d6e7f8a9b0c',
      };

      const saveMock = jest.fn().mockResolvedValue({
        _id: 'serviceId',
        ...mockDto,
      });

      service['serviceModel'] = jest.fn().mockImplementation(() => ({
        save: saveMock,
      })) as any;

      const result = await service.create(mockDto as any);

      expect(result.name).toBe('Haircut');
      expect(result.price).toBe(20);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  
  describe('findAll()', () => {
    it('should return all services', async () => {
      const mockServices = [
        { _id: 'service1', name: 'Haircut' },
        { _id: 'service2', name: 'Massage' },
      ];

      mockServiceModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockServices),
      });

      const result = await service.findAll();
      expect(result).toEqual(mockServices);
      expect(mockServiceModel.find).toHaveBeenCalled();
    });
  });

  
  describe('findById()', () => {
    it('should return a service if found', async () => {
      const mockService = {
        _id: '648a1f2e3b4c5d6e7f8a9b0c',
        name: 'Haircut',
      };

      mockServiceModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockService),
      });

      const result = await service.findById('648a1f2e3b4c5d6e7f8a9b0c');
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException for invalid ID', async () => {
      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if service not found', async () => {
      mockServiceModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findById('648a1f2e3b4c5d6e7f8a9b0c'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});