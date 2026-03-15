import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { NotFoundException } from '@nestjs/common';

const mockServicesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
};

describe('ServicesController', () => {
  let controller: ServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        { provide: ServicesService, useValue: mockServicesService },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
  });

  afterEach(() => jest.clearAllMocks());

  
  describe('create()', () => {
    it('should create a service and return it', async () => {
      const mockDto = {
        name: 'Haircut',
        description: 'A simple haircut',
        duration: 30,
        price: 20,
        staffId: '648a1f2e3b4c5d6e7f8a9b0c',
      };

      const mockService = { _id: 'serviceId', ...mockDto };
      mockServicesService.create.mockResolvedValue(mockService);

      const result = await controller.create(mockDto as any);
      expect(result).toEqual(mockService);
      expect(mockServicesService.create).toHaveBeenCalledWith(mockDto);
    });
  });

  
  describe('findAll()', () => {
    it('should return all services', async () => {
      const mockServices = [
        { _id: 'service1', name: 'Haircut', price: 20 },
        { _id: 'service2', name: 'Massage', price: 50 },
      ];

      mockServicesService.findAll.mockResolvedValue(mockServices);

      const result = await controller.findAll();
      expect(result).toEqual(mockServices);
      expect(mockServicesService.findAll).toHaveBeenCalled();
    });

    it('should return empty array if no services exist', async () => {
      mockServicesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });


  describe('findOne()', () => {
    it('should return a service if found', async () => {
      const mockService = {
        _id: '648a1f2e3b4c5d6e7f8a9b0c',
        name: 'Haircut',
        price: 20,
      };

      mockServicesService.findById.mockResolvedValue(mockService);

      const result = await controller.findOne('648a1f2e3b4c5d6e7f8a9b0c');
      expect(result).toEqual(mockService);
      expect(mockServicesService.findById).toHaveBeenCalledWith(
        '648a1f2e3b4c5d6e7f8a9b0c',
      );
    });

    it('should throw NotFoundException for invalid ID', async () => {
      mockServicesService.findById.mockRejectedValue(
        new NotFoundException('Invalid service ID'),
      );

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if service not found', async () => {
      mockServicesService.findById.mockRejectedValue(
        new NotFoundException('Service not found'),
      );

      await expect(
        controller.findOne('648a1f2e3b4c5d6e7f8a9b0c'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});