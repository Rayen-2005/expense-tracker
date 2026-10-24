
# Expense Tracker

A full-stack expense tracking application built with Java,
Spring Boot, MySQL, HTML, CSS, and JavaScript.

## Overview

Expense Tracker allows users to manage personal expenses,
track spending, and visualize their spending habits
through an interactive dashboard.

The application uses a Spring Boot REST API connected to
a MySQL database, with a responsive JavaScript frontend.

## Features

- Add new expenses
- View all transactions
- Edit existing expenses
- Delete expenses
- Search expenses by description
- Filter expenses by category
- View total and monthly spending
- Track transaction counts
- Identify the highest-spending category
- Interactive category spending chart
- Backend input validation
- JSON error responses
- Automated unit tests

## Technologies

### Backend
- Java 21
- Spring Boot 4.0.8
- Spring Data JPA
- Hibernate
- REST API
- Maven

### Database
- MySQL 8.4

### Frontend
- HTML5
- CSS3
- JavaScript
- Chart.js

### Testing
- JUnit
- Mockito

## Project Architecture

Controller → Service → Repository → MySQL

- Controller: Handles HTTP requests
- Service: Implements application business logic
- Repository: Performs database operations
- Model: Defines expense entities
- Exception Handler: Handles API errors

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | Get all expenses |
| GET | /api/expenses/{id} | Get expense by ID |
| POST | /api/expenses | Add an expense |
| PUT | /api/expenses/{id} | Update an expense |
| DELETE | /api/expenses/{id} | Delete an expense |

## Database Setup

Create the MySQL database:

```sql
CREATE DATABASE expense_tracker;
```

Create a dedicated application user using a secure password:

```sql
CREATE USER 'expense_app'@'localhost'
IDENTIFIED BY 'YOUR_STRONG_PASSWORD';

GRANT ALL PRIVILEGES ON expense_tracker.*
TO 'expense_app'@'localhost';
```

The application uses the `DB_PASSWORD` environment
variable rather than storing the database password
directly in source code.

## Running the Application

1. Install Java 21 or a compatible newer JDK.
2. Install MySQL and create the database.
3. Clone this repository.
4. Set the `DB_PASSWORD` environment variable.
5. Run the application using Maven.

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

macOS/Linux:

```bash
./mvnw spring-boot:run
```

Open:

http://localhost:8080/

## Testing

Run the automated tests:

Windows:

```powershell
.\mvnw.cmd test
```

macOS/Linux:

```bash
./mvnw test
```

The project includes six ExpenseService unit tests
covering CRUD operations and missing expense handling.

## Future Improvements

- User authentication
- Multiple user accounts
- Monthly budgets
- Expense export to CSV
- Advanced analytics
- Cloud deployment

## Author

Computer Science Portfolio Project
