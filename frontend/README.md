# Laaerberg Apart Hotel Frontend

This is the frontend application for the Laaerberg Apart Hotel website. It's built using React, TypeScript, and Tailwind CSS.

## 🏨 Features

- Responsive design for all device sizes
- Multi-language support with i18next
- Modern UI with Tailwind CSS
- Apartment search and filtering
- Online reservation system
- Admin dashboard for managing reservations and apartments
- Mock API for development without backend dependency

## 🛠️ Technologies

- React 18
- TypeScript
- React Router v6
- Tailwind CSS
- i18next for internationalization
- React Icons
- Axios for API requests

## 📋 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ariofarmani/laaerbergHotel.git
cd laaerbergHotel/frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📁 Project Structure

```
frontend/
├── public/               # Public assets
├── src/                  # Source files
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions and helpers
│   │   ├── api.ts        # API service functions
│   │   ├── mockApi.ts    # Mock API implementations
│   │   ├── mockData.ts   # Mock data utility
│   │   └── types.ts      # TypeScript interfaces
│   ├── App.css           # Main CSS file with Tailwind imports
│   ├── App.tsx           # Main App component with routing
│   ├── i18n.ts           # Internationalization configuration
│   └── index.tsx         # Entry point
├── package.json          # Dependencies and scripts
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🌐 Available Routes

- `/` - Home page
- `/apartments` - Apartments listing
- `/apartments/:id` - Apartment details
- `/reservation` - Make a reservation
- `/reservation/:apartmentId` - Make a reservation for a specific apartment
- `/contact` - Contact page
- `/admin/login` - Admin login
- `/admin/dashboard/*` - Admin dashboard (protected route)

## 🔄 Development Mode

The application uses mock data by default for development. To use the real API:

1. Set the environment variable in your `.env` file:
```
REACT_APP_USE_MOCK_API=false
```

2. Make sure the backend API is running and accessible.

## 🚀 Deployment

To build the production version:

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build` folder.

## 🧪 Testing

```bash
npm test
# or
yarn test
```

## 🔁 Internationalization

The application supports multiple languages. Currently implemented:

- English (en)
- German (de)

To add a new language, update the `i18n.ts` file with new translations.

## 👥 Contributors

- Ali Farmani

## 📄 License

This project is licensed under the MIT License.