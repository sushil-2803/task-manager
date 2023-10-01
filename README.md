# Task Manager API

Task Manager API is a RESTful service built using Node.js, MongoDB, JWT (JSON Web Tokens), Multer for handling file uploads, and tested with Mocha and Supertest. It enables users to manage tasks and profiles, including features such as adding, updating, deleting, and reading tasks. Users can also create, update, and delete their profiles and add a profile image.

The API is deployed and can be accessed at [https://task-manager-api-107m.onrender.com/](https://task-manager-api-107m.onrender.com/).

## Features

- **Task Management**: Add, update, delete, and read tasks using RESTful endpoints.
- **User Profile Management**: Create, update, and delete user profiles.
- **Profile Image Upload**: Users can add a profile image to their profiles.
- **Authentication**: JWT-based authentication for secure API access.
- **Testing**: Utilize Mocha and Supertest for comprehensive API testing.
- **Postman Collection**: Convenient API testing with the provided Postman collection.

## API Documentation

The API has the following endpoints:

- **Tasks**
  - `GET /tasks`: Get all tasks.
  - `GET /tasks/:id`: Get a specific task.
  - `POST /tasks`: Add a new task.
  - `PATCH /tasks/:id`: Update a task.
  - `DELETE /tasks/:id`: Delete a task.

- **Users/Profiles**
  - `POST /users`: Create a new user profile.
  - `PATCH /users/:id`: Update user profile.
  - `DELETE /users/:id`: Delete user profile.
  - `POST /users/me/avatar`: Upload a profile image.
  - `GET /users/:id/avatar`: Get user profile image.

## Prerequisites

Before using the API, ensure you have the following tools installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Postman](https://www.postman.com/)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/sushil-2803/task-manager.git
   ```

2. Navigate to the project directory:

   ```bash
   cd task-manager
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:

     ```env
     PORT=3000
     MONGODB_URL=your-mongodb-connection-url
     JWT_SECRET=your-jwt-secret
     ```

5. Start the application:

   ```bash
   npm start
   ```

6. Open Postman and import the provided collection (`Task_Manager_API.postman_collection.json`) for testing.

## Testing

Run tests using Mocha and Supertest:

```bash
npm test
```

## Usage

1. Register a new user using the `/users` endpoint.
2. Obtain an authentication token.
3. Use the token to access other API endpoints, such as tasks and user profiles.

Refer to the Postman collection for detailed examples and API requests.

## Deployment

The API is deployed and can be accessed at [https://task-manager-api-107m.onrender.com/](https://task-manager-api-107m.onrender.com/).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

Feel free to explore the API and manage your tasks seamlessly! 🚀
