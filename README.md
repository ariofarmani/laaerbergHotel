# Laaerberg Apart Hotel

Welcome to the Laaerberg Apart Hotel project repository. This is a modern responsive hotel booking website with an admin panel for managing apartments, reservations, and settings.

## 🌟 Features

- **Public Website**
  - Homepage with featured apartments and search
  - Apartment listings with filters
  - Detailed apartment pages with image galleries
  - Booking system with multi-step form
  - Contact page
  - Responsive design for all devices

- **Admin Dashboard**
  - Secure login and authentication
  - Dashboard with statistics
  - Apartment management (add, edit, delete)
  - Reservation management and booking history
  - User management
  - Settings and configurations

## 🛠️ Technology Stack

- **Frontend**
  - React with TypeScript
  - React Router for navigation
  - Tailwind CSS for styling
  - i18next for multilingual support
  - React Icons for icon components

- **State Management & API**
  - Context API for global state
  - Axios for API requests
  - Mock API for development

## 📁 Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   │   ├── Admin/    # Admin panel pages
│   │   └── Booking/  # Booking flow pages
│   ├── utils/        # Utility functions and helpers
│   │   ├── api.ts    # API configuration
│   │   ├── mockApi.ts # Mock API for development
│   │   ├── mockData.ts # Mock data helpers
│   │   ├── helpers.ts # Helper functions
│   │   ├── hooks.ts  # Custom React hooks
│   │   ├── types.ts  # TypeScript interfaces
│   │   └── AuthContext.tsx # Authentication context
│   ├── App.tsx       # Main App component
│   ├── App.css       # Global styles
│   ├── index.tsx     # Entry point
│   ├── index.css     # Global CSS
│   └── i18n.ts       # i18n configuration
├── tailwind.config.js # Tailwind configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies
```

## 🧩 Components

### Core Components
- **Button** - Reusable button with variants
- **Card** - Flexible card component for content
- **Input** - Form input with validation
- **Alert** - Notification component
- **Modal** - Popup dialog component
- **Loading** - Loading spinner component
- **Pagination** - Pagination control

### Feature Components
- **Header & Footer** - Site navigation and footer
- **SearchForm** - Apartment search form
- **ApartmentCard** - Card for apartment listings
- **DateRangePicker** - Date picker for bookings
- **ImageGallery** - Image carousel for apartments
- **Testimonial** - Customer review component
- **Breadcrumbs** - Navigation breadcrumbs

### Admin Components
- **AdminLayout** - Layout for admin area
- **StatsCard** - Statistics display card
- **Tabs** - Tab navigation component
- **ApartmentForm** - Form for adding/editing apartments

## 📱 Pages

### Public Pages
- **Home** - Landing page
- **Apartments** - Apartment listings
- **ApartmentDetail** - Single apartment view
- **Contact** - Contact page
- **Reservation** - Booking process
- **BookingConfirmation** - Booking confirmation
- **NotFound** - 404 page

### Admin Pages
- **AdminLogin** - Admin login
- **Dashboard** - Admin dashboard
- **Apartments** - Apartment management
- **Reservations** - Reservation management

## 🚀 Getting Started

1. Clone the repository
```bash
git clone https://github.com/ariofarmani/laaerbergHotel.git
cd laaerbergHotel
```

2. Install dependencies
```bash
cd frontend
npm install
```

3. Start the development server
```bash
npm start
```

## 🌍 Internationalization

The application supports multiple languages using i18next. Currently, it includes:
- English
- German

## 🔒 Authentication

Authentication is managed through the AuthContext provider. For development, mock authentication is used. In production, this would be connected to a real authentication API.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Contributed by

- Ali Farmani - [GitHub](https://github.com/ariofarmani)