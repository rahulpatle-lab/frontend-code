# License Management Frontend

A comprehensive React frontend application for managing licenses, subscriptions, and customers. Built with TypeScript, React Router, Tailwind CSS, and modern React patterns.

## Features

### Admin Features
- **Dashboard**: Overview of system statistics and recent activities
- **Customer Management**: Create, read, update, and delete customer accounts
- **Subscription Pack Management**: Manage subscription packages and pricing
- **Subscription Management**: Approve requests, assign subscriptions, and manage statuses

### Customer Features
- **Subscription Management**: View current subscription, request new subscriptions
- **Subscription History**: View past subscription activities
- **Self-Service**: Deactivate subscriptions and manage account

### Authentication
- **Role-based Access**: Separate admin and customer interfaces
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Automatic redirection based on user role

## Tech Stack

- **React 18** with TypeScript
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd license-management-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update the API URL in `.env` file
```
REACT_APP_API_URL=http://localhost:8080
```

5. Start the development server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── routing/        # Routing configuration
│   └── ui/             # Basic UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   └── customer/       # Customer pages
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## API Integration

The application integrates with a REST API based on the OpenAPI specification. Key endpoints include:

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/customer/login` - Customer login
- `POST /api/customer/signup` - Customer registration

### Admin APIs
- `GET /api/v1/admin/dashboard` - Dashboard data
- `GET /api/v1/admin/customers` - List customers
- `GET /api/v1/admin/subscription-packs` - List subscription packs
- `GET /api/v1/admin/subscriptions` - List subscriptions

### Customer APIs
- `GET /api/v1/customer/subscription` - Current subscription
- `POST /api/v1/customer/subscription` - Request subscription
- `GET /api/v1/customer/subscription-history` - Subscription history

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8080)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.