import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockBookingsService = {
  findAll: jest.fn(),
  create: jest.fn(),
};

describe('BookingsController', () => {
  let controller: BookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        { provide: BookingsService, useValue: mockBookingsService },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  afterEach(() => jest.clearAllMocks());

  
  describe('findAll()', () => {
    it('should return all bookings', async () => {
      const mockBookings = [
        {
          _id: 'booking1',
          status: 'pending',
          customerId: 'customer1',
          serviceId: 'service1',
        },
        {
          _id: 'booking2',
          status: 'confirmed',
          customerId: 'customer2',
          serviceId: 'service2',
        },
      ];

      mockBookingsService.findAll.mockResolvedValue(mockBookings);

      const result = await controller.findAll();
      expect(result).toEqual(mockBookings);
      expect(mockBookingsService.findAll).toHaveBeenCalled();
    });

    it('should return empty array if no bookings exist', async () => {
      mockBookingsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });


  describe('create()', () => {
    
    const mockReq = {
      user: {
        userId: 'customerId',
        email: 'john@test.com',
        role: 'customer',
      },
    };

    const mockDto = {
      serviceId: 'serviceId',
      startTime: '2026-03-20T10:00:00.000Z',
    };

    it('should create a booking and return it', async () => {
      const mockBooking = {
        _id: 'bookingId',
        customerId: mockReq.user.userId,
        serviceId: mockDto.serviceId,
        status: 'pending',
        totalPrice: 100,
      };

      mockBookingsService.create.mockResolvedValue(mockBooking);

      const result = await controller.create(mockDto as any, mockReq as any);
      expect(result).toEqual(mockBooking);
      expect(mockBookingsService.create).toHaveBeenCalledWith(
        mockDto,
        mockReq.user.userId,
      );
    });

    it('should throw ConflictException if staff already booked', async () => {
      mockBookingsService.create.mockRejectedValue(
        new ConflictException('Staff already booked for this time'),
      );

      await expect(
        controller.create(mockDto as any, mockReq as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if service not found', async () => {
      mockBookingsService.create.mockRejectedValue(
        new NotFoundException('Service not found'),
      );

      await expect(
        controller.create(mockDto as any, mockReq as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});