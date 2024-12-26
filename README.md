# Wedding Planner App

A comprehensive mobile application built with React Native and Expo to help couples plan and manage their wedding efficiently.

## Features

### 🏠 Home Dashboard
- Overview of wedding planning progress
- Days countdown to the wedding
- Quick access to all features
- Real-time progress tracking

### 📅 Timeline Management
- Create and manage wedding-related tasks
- Set task priorities and due dates
- Track task completion status
- Categorize tasks (ceremony, reception, etc.)
- Dependencies tracking

### 💰 Budget Tracking
- Set and manage total wedding budget
- Track expenses by category
- Monitor actual vs estimated costs
- Real-time budget utilization
- Remaining budget calculation

### 👥 Guest Management
- Manage guest list with RSVP status
- Track dietary restrictions
- Age group categorization
- Plus-one management
- Table assignment system

### 🤝 Vendor Management
- Track and manage vendors by category
- Store vendor contact information
- Track quotes and proposals
- Monitor vendor status (researching to hired)
- Store vendor-related documents

### 🌐 Additional Features
- Multi-language support (English, Georgian)
- Data persistence
- Intuitive user interface
- Real-time updates
- Progress visualization

## Technology Stack

- **Framework**: React Native
- **Build Tool**: Expo
- **Styling**: TailwindCSS (NativeWind)
- **State Management**: React Hooks
- **Storage**: AsyncStorage
- **Navigation**: Expo Router
- **Internationalization**: i18next
- **Icons**: Expo Vector Icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wedding-planner.git
cd wedding-planner
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your desired platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
wedding-planner/
├── app/                    # Main application code
│   ├── (auth)/            # Authenticated screens
│   ├── (public)/          # Public screens
│   ├── components/        # Reusable components
│   │   ├── features/      # Feature-specific components
│   │   └── shared/        # Shared components
│   ├── translations/      # Language files
│   └── utils/            # Utility functions
├── assets/               # Static assets
└── ...
```

## Features in Detail

### Timeline Management
- Create, edit, and delete tasks
- Set task priorities (high, medium, low)
- Track task status (not started, in progress, completed)
- Categorize tasks by type
- Set dependencies between tasks

### Budget Management
- Set and adjust total budget
- Add budget items with estimated costs
- Track actual expenses
- Categorize expenses
- Monitor budget utilization

### Guest Management
- Add and manage guests
- Track RSVP status
- Manage dietary restrictions
- Table assignments
- Plus-one management

### Vendor Management
- Track vendor details and contacts
- Store and compare quotes
- Monitor vendor status
- Store important documents
- Track vendor communications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Ionicons](https://ionicons.com/)
- UI components inspired by [TailwindCSS](https://tailwindcss.com/)
