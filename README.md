# Comp4442 Front End React

A frontend room booking system built with **React**, **TypeScript**, and **Vite**.  
This project provides the user interface for browsing rooms, checking availability, creating bookings, and managing booking records. It is designed to work with the Spring Boot backend in the companion repository.

---

## Features

- User sign up
- User login and logout
- Fetch and display room list
- Check room availability by date range
- Create booking records
- View personal booking history
- Cancel upcoming bookings
- Admin view for all bookings
- Admin edit and cancel booking records
- Route protection for authenticated users and admin users
- Toast notifications for user actions

---

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **React Router DOM**
- **Tailwind CSS**
- **Flowbite**
- **react-hot-toast**

---

## Project Structure

```bash
src/
├── assets/              # Images and static assets
├── components/
│   ├── form/            # Booking pages, user bookings, admin bookings
│   ├── header/          # Header, sign in, sign up modal
│   ├── home/            # Home page
│   └── room/            # Room item card and booking UI
├── controller/          # Protected routes
├── store/               # Global auth context
├── type/                # Shared TypeScript types
├── App.tsx              # Main app routing
└── main.tsx             # App entry point
```

---

## Routing

This project uses React Router for page navigation.

### Main Routes

- `/` → Home page
- `/bookings` → Booking page for logged-in users
- `/admin` → Admin booking management page

---

## Backend Connection

This frontend is currently connected to a backend running at:

```bash
http://localhost:8080
```

The frontend calls backend APIs such as:

- `POST /register`
- `POST /login`
- `POST /signout`
- `GET /me`
- `GET /rooms`
- `POST /bookings`
- `GET /bookings/my`
- `GET /bookings/all`
- `PUT /bookings/{id}`
- `DELETE /bookings/{id}`
- `GET /bookings/check`
- `GET /admin/users`

If you deploy the backend to AWS, Render, Railway, or another platform, update the API base URL inside the frontend source code.

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/herb4794/Comp4442_front_end_react.git
cd Comp4442_front_end_react
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

---

## Requirements

Make sure you have the following installed:

- **Node.js**
- **npm**

---

## How It Works

### User side
Users can browse rooms on the home page, choose check-in and check-out dates, check whether a room is available, and submit a booking after login.

### Booking management
Logged-in users can open the booking page to view their booking history. Upcoming bookings can be cancelled.

### Admin side
Admin users can view all bookings, search and filter records, edit booking dates, and cancel bookings.

---

## Authentication

Authentication state is managed with a global React Context.  
The app checks login status through the backend endpoint:

```bash
GET /me
```

User logout is handled through:

```bash
POST /signout
```

Protected routes are implemented for:
- Logged-in users
- Admin users

---

## Notes

- The frontend expects the backend server to be running before API requests will work.
- Some requests use `credentials: "include"` for session handling, so backend CORS and cookie settings must be configured correctly.
- The current API URLs are hardcoded to `http://localhost:8080`.

---

## Future Improvements

- Move API base URL into environment variables
- Add form validation improvements
- Improve error handling
- Add loading skeletons
- Add room details page
- Add responsive UI improvements for mobile devices

---

## Related Backend Repository

Spring Boot backend repository:

```bash
https://github.com/herb4794/Comp4443_backend_spring_boot_java
```

---

## Author

Frontend project by **Cheng Man Hon** and **TSANG Chun Hei**.

