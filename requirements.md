COACH BOOKING SYSTEM
Requirements Document

1. System Overview
The Coach Booking System is a web-based platform that enables coaches to manage their services and availability, while customers can discover coaches, book sessions, and make deposit payments in order to book a session. The system is built using NestJS (backend), Next.js (frontend), and MongoDB (database).

2. Objectives
•	Allow coaches to create and manage their coaching services
•	Allow customers to browse available services and book sessions
•	Implement a deposit payment flow to confirm bookings
•	Send automated email confirmations to both coach and customer
•	Provide a dashboard with booking and service statistics

3. User Types
3.1 Coach
•	Creates and manages coaching services
•	Sets weekly availability (days and time slots)
•	Views all bookings and their statuses
•	Receives email confirmation when a booking is confirmed

3.2 Customer
•	Browses available coaching services
•	Views coach profiles and availability
•	Views their bookings
•	Pays 50% deposit to confirm a booking
•	Receives email confirmation when deposit is paid


4. Main Features
4.1 Authentication
•	User registration with name, email, password and role (coach or customer)
•	JWT-based login with token stored in localStorage.
•	Protected routes — unauthenticated users are redirected to login

4.2 Services Management (Coach)
•	Create a service with name, description, duration and price.
•	Services are linked to the coach who created them.
•	Coaches set their weekly availability (days and time slots).
•	All users can view services with coach details and availability.

4.3 Booking Management
•	Coach creates a booking by selecting a service, customer, and time slot
•	Customer pays 50% deposit via a dummy payment button
•	On deposit payment, status changes to 'confirmed'
•	Confirmation email sent to both coach and customer
•	Bookings can be cancelled by either party

4.4 Dashboard
•	Coaches see: total services, total bookings, confirmed and completed sessions
•	Customers see: total bookings, confirmed and completed sessions

4.5 Email Notifications
•	Triggered automatically when a booking is confirmed (deposit paid)
•	Customer email: service name, coach name, date/time, price, deposit paid
•	Coach email: service name, customer name, date/time, price, deposit paid


5. Important Workflows
5.1 Booking Workflow
Step 1: Coach creates a service and sets availability
Step 2: Customer browses services and views coach availability
Step 3: Coach creates a booking for the customer
Step 4: Booking status = 'pending'
Step 5: Customer pays 50% deposit
Step 6: Booking status = 'confirmed', emails sent to both parties

5.2 Registration & Login Workflow
Step 1: User registers with name, email, password, and role
Step 2: JWT token returned and stored
Step 3: User redirected to dashboard
Step 4: All subsequent requests include Bearer token in header


6. Information Requirements
6.1 Creating a Booking
•	Service ID — which service is being booked
•	Customer ID — who the booking is for
•	Start time — when the session begins (ISO datetime)
•	End time — calculated automatically from service duration
•	Total price — taken from the service price
•	Status — starts as 'pending', changes to 'confirmed' after deposit

6.2 Managing Bookings
•	View all bookings with service name, customer name, status
•	View individual booking details
•	Pay deposit to confirm a booking
•	Cancel a booking
•	Update booking status (pending, confirmed, completed, cancelled)

7. Non-Functional Requirements
•	Input validation on all API endpoints using class-validator
•	JWT authentication on all protected routes
•	CORS enabled to allow frontend-backend communication
•	Error handling with appropriate HTTP status codes
•	MongoDB schema transforms to return 'id' instead of '_id'
•	Password hashing using bcrypt before storing in database
•	Email notifications using nodemailer/SMTP
