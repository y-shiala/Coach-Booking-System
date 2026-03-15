import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getModelToken } from '@nestjs/mongoose';
import { Booking } from './schemas/booking.schema';
import { ConflictException, NotFoundException } from '@nestjs/common'; // 👈 static import
import { ServicesService } from '../services/services.service';

const mockBookingModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockServicesService = {
  findById: jest.fn(),
};

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getModelToken(Booking.name), useValue: mockBookingModel },
        { provide: ServicesService, useValue: mockServicesService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => jest.clearAllMocks());

  
  describe('findAll()', () => {
    it('should return all bookings', async () => {
      const mockBookings = [
        { _id: 'booking1', status: 'pending' },
        { _id: 'booking2', status: 'confirmed' },
      ];

      mockBookingModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBookings),
      });

      const result = await service.findAll();
      expect(result).toEqual(mockBookings);
      expect(mockBookingModel.find).toHaveBeenCalled();
    });
  });

  
  describe('create()', () => {
    const mockService = {
      _id: 'serviceId',
      staffId: 'staffId',
      price: 100,
      duration: 60,
    };

    const mockDto = {
      serviceId: 'serviceId',
      startTime: '2026-03-20T10:00:00.000Z',
    };

    const customerId = 'customerId';

    it('should create a booking successfully', async () => {
      mockServicesService.findById.mockResolvedValue(mockService);

      mockBookingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const saveMock = jest.fn().mockResolvedValue({
        _id: 'bookingId',
        customerId,
        serviceId: mockDto.serviceId,
        staffId: mockService.staffId,
        status: 'pending',
        totalPrice: mockService.price,
      });

      service['bookingModel'] = jest.fn().mockImplementation(() => ({
        save: saveMock,
      })) as any;

      
      (service['bookingModel'] as any).findOne = mockBookingModel.findOne;

      const result = await service.create(mockDto as any, customerId);
      expect(result.status).toBe('pending');
      expect(saveMock).toHaveBeenCalled();
    });

    it('should throw ConflictException if staff is already booked', async () => {
      mockServicesService.findById.mockResolvedValue(mockService);

      mockBookingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'existingBooking' }),
      });

      await expect(
        service.create(mockDto as any, customerId),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if service does not exist', async () => {
      
      mockServicesService.findById.mockRejectedValue(
        new NotFoundException('Service not found'),
      );

      await expect(
        service.create(mockDto as any, customerId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});