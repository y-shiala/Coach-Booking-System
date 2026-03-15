export type UserRole = 'admin' | 'coach' | 'customer';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  bio?: string;
  price_per_hour?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  staffId: string | {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    price_per_hour?: number;
    availability?: Record<string, string[]>;
  };
  coach?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface Availability {
  id: string;
  coachId: string;
  timeSlots: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  serviceId: string | Service;  
  service?: Service;
  staffId: string | User;        
  coach?: User;
  customerId: string | User;     
  customer?: User;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
