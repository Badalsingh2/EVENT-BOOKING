# Event Management System

## Overview
The Event Management System is a web-based platform that allows users to browse, book, and manage events. It supports three types of users: attendees, organizers, and administrators. The system includes event registration, booking management, payment integration (Stripe/Razorpay), and role-based access control (RBAC).

## Features
- User authentication (JWT-based)
- Event creation and management
- Booking system with seat availability
- Payment integration (Stripe/Razorpay)
- Role-based access control (Attendee, Organizer, Admin)
- MongoDB Atlas for data storage
- FastAPI backend with Next.js frontend

## Technologies Used
- **Backend:** FastAPI (Python), MongoDB Atlas, JWT Authentication
- **Frontend:** Next.js (TypeScript, ShadCN)
- **Database:** MongoDB Atlas
- **Hosting:** EC2 instance with Nginx as a reverse proxy

## Installation
### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/event-management-system.git
   cd event-management-system/backend
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv myenv
   source myenv/bin/activate  # On Windows use: myenv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the frontend:
   ```sh
   npm run dev
   ```

## API Endpoints
### Authentication
- `POST /auth/login` - Login a user
- `POST /auth/register` - Register a new user

### Events
- `GET /events` - Get all events
- `POST /events` - Create a new event (Organizer/Admin only)
- `GET /events/{event_id}` - Get event details
- `DELETE /events/{event_id}` - Delete an event (Admin only)

### Bookings
- `POST /bookings/{event_id}` - Book an event
- `GET /users/{user_id}` - Get user details including booked events

## Login Credentials
### Attendee
- **Username:** `badal12@gmail.com`
- **Password:** `badal159`

### Organizer
- **Username:** `12badal@gmail.com`
- **Password:** `SecurePass123!`

### Admin
- **Username:** `john.doe@example.com`
- **Password:** `securePassword123`

## Deployment
1. **Backend**
   - Deploy FastAPI on an AWS EC2 instance
   - Set up Nginx as a reverse proxy

2. **Frontend**
   - Deploy Next.js frontend on the same EC2 instance
   - Use PM2 for process management

## Future Enhancements
- Add email notifications for bookings
- Implement event analytics dashboard
- Improve UI with real-time updates

## License
This project is licensed under the MIT License.

