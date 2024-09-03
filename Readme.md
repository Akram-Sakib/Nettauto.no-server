# University Management System Authentication Service

This is the documentation for the Authentication Service component of the University Management System. The Authentication Service provides authentication and authorization functionalities for the three main roles in the system: Admin, Student, and Faculty. It is built using TypeScript, Express.js, Zod validation, and MongoDB.

## Functional Requirements

### Student

- Student can login and log out.
- Student can manage and update their profile.
- Student can update certain fields.

### Admin

- Admin can log in and log out.
- Admin can manage and update their profile.
- Admin can only update certain fields.
- Admin can manage user accounts:
  - Change Password

### Faculty

- Faculty can log in and log out.
- Faculty can manage and update their profile.
- Faculty can only update certain fields.

## API Endpoints

### User

- `POST /users/create-student`
- `POST /users/create-faculty`
- `POST /users/create-admin`

### Student

- `GET /students`
- `GET /students?searchTerm=fr797`
- `GET /students?page=1&limit=10&sortBy=gender&sortOrder=asc`
- `GET /students/:id`
- `PATCH /students/:id`
- `DELETE /students/:id`

### Faculty

- `GET /faculties`
- `GET /faculties?searchTerm=john`
- `GET /faculties?page=1&limit=10&sortBy=gender&sortOrder=asc`
- `GET /faculties/:id`
- `PATCH /faculties/:id`
- `DELETE /faculties/:id`

### Admin

- `GET /admins`
- `GET /admins?searchTerm=us88`
- `GET /admins?page=1&limit=10&sortBy=gender&sortOrder=asc`
- `GET /admins/:id`
- `PATCH /admins/:id`
- `DELETE /admins/:id`

### Academic Semester

- `POST /-semesters/create-semester`
- `GET /-semesters`
- `GET /-semesters?searchTerm=fal`
- `GET /-semesters?page=1&limit=10&sortBy=year&sortOrder=asc`
- `GET /-semesters/:id`
- `PATCH /-semesters/:id`
- `DELETE /-semesters/:id`

### Academic Car

- `POST /-cars/create-car`
- `GET /-cars`
- `GET /-cars?searchTerm=math`
- `GET /-cars?page=1&limit=10&sortBy=title&sortOrder=asc`
- `GET /-cars/:id`
- `PATCH /-cars/:id`
- `DELETE /-cars/:id`

### Academic Faculty

- `POST /-faculties/create-faculty`
- `GET /-faculties`
- `GET /-faculties?searchTerm=com`
- `GET /-faculties?page=1&limit=10&sortBy=title&sortOrder=asc`
- `GET /-faculties/:id`
- `PATCH /-faculties/:id`
- `DELETE /-faculties/:id`

### Authentication

- `POST /auth/login`
- `POST /auth/change-password`
- `POST /auth/refresh-token`

Postman Documenttaion: [Click Here](https://documenter.getpostman.com/view/26682150/2s93zB72V9#acc25f08-de78-478b-809d-837ce239d2b3)
