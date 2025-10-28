# License Management Frontend

A comprehensive React frontend application for managing licenses, subscriptions, and customers.

## Quick Start

1. Navigate to the project directory:
```bash
cd license-management-frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

All the project files are located in the `license-management-frontend/` directory:

```
license-management-frontend/
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── hooks/       # Custom hooks
│   ├── types/       # TypeScript types
│   └── utils/       # Utility functions
├── package.json     # Dependencies
├── tsconfig.json    # TypeScript config
├── tailwind.config.js
├── postcss.config.js
└── openapi.yaml     # API specification
```

## Features

- **Admin Dashboard**: Manage customers, subscription packs, and subscriptions
- **Customer Portal**: View and manage personal subscriptions
- **Authentication**: Role-based access control
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Environment Variables

Create a `.env` file in `license-management-frontend/` directory:

```
REACT_APP_API_URL=http://localhost:8080
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

For more details, see the README in the `license-management-frontend/` directory.
