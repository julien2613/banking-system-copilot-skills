# Banking System

A full-stack banking application built with Spring Boot and React, featuring secure user authentication, account management, and transaction processing.

## Features

- **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Role-based access control

- **Account Management**
  - View account balance and details
  - Update profile information
  - Transaction history

- **Transactions**
  - Transfer money between accounts
  - View transaction history
  - Real-time balance updates

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: (Specify your database, e.g., PostgreSQL/MySQL)
- **Security**: Spring Security with JWT
- **Build Tool**: Maven
- **Java Version**: 17+

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router

## Prerequisites

- JDK 17 or higher
- Node.js 16+ and npm/yarn
- (Database engine, e.g., PostgreSQL 14+)
- Maven 3.8+

## Getting Started

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR-USERNAME/Banking-System.git
   cd Banking-System/backend
   ```

2. Configure database in `application.properties`
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/banking
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Build and run the application
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
# Add other environment variables as needed
```

## Project Structure

```
Banking-System/
├── backend/               # Spring Boot application
│   ├── src/
│   │   ├── main/java/com/banking/
│   │   │   ├── config/    # Configuration classes
│   │   │   ├── controller/# REST controllers
│   │   │   ├── dto/       # Data Transfer Objects
│   │   │   ├── model/     # JPA entities
│   │   │   ├── repository/# Data access layer
│   │   │   ├── security/  # Security configuration
│   │   │   └── service/   # Business logic
│   │   └── resources/     # Application properties, static files
│   └── pom.xml            # Maven configuration
│
└── frontend/              # React application
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components
    │   ├── services/      # API service layer
    │   └── contexts/      # React contexts
    └── package.json       # NPM configuration
```

## API Documentation

API documentation is available at `http://localhost:8080/swagger-ui.html` when running the backend.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
