# JamiiFund Dashboard

A comprehensive community fund management dashboard built with Next.js and Supabase. This application provides tools for tracking community funds, managing members, monitoring financial activities, and generating insightful reports for community-based financial management.

## Features

- **Dashboard Overview**: Real-time metrics and key performance indicators
- **Fund Tracking**: Monitor and manage community fund balances and transactions
- **Member Management**: User registration, profiles, and member activity tracking
- **Financial Reporting**: Revenue tracking, investment monitoring, and financial analytics
- **Activity Feed**: Recent transactions and community activities
- **Responsive Design**: Fully responsive interface with modern purple-themed UI
- **Real-time Data**: Live updates powered by Supabase real-time subscriptions
- **Secure Authentication**: User authentication and authorization via Supabase

## Tech Stack

- **Frontend**: [Next.js 15.4.5](https://nextjs.org/) - React framework for production
- **Backend**: [Supabase](https://supabase.com/) - Open source Firebase alternative
- **Database**: PostgreSQL (via Supabase)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [React Icons 5.5.0](https://react-icons.github.io/react-icons/) - Popular icon library
- **Runtime**: React 19.1.0 with modern React features

## Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Supabase Account**: For database and authentication services

## Installation Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/salumusabri05/jamiifund_dashboard.git
   cd jamiifund_dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the environment template (see Environment Variables section below)
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials and other required variables

4. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com/)
   - Set up your database tables and authentication
   - Copy the project URL and anon key to your environment variables

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You should see the JamiiFund Dashboard

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Additional configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### How to get Supabase credentials:
1. Go to [supabase.com](https://supabase.com/) and create an account
2. Create a new project
3. Go to Settings → API
4. Copy the "Project URL" and "Project API keys" (anon/public key)

## Usage Instructions

### Development
Start the development server with hot reloading:
```bash
npm run dev
```
Access the application at [http://localhost:3000](http://localhost:3000)

### Production Build
Create an optimized production build:
```bash
npm run build
```

### Start Production Server
Run the production server:
```bash
npm run start
```

### Linting
Check code quality and consistency:
```bash
npm run lint
```

## Project Structure

```
jamiifund_dashboard/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── Home/          # Dashboard home page
│   │   │   ├── components/ # Dashboard-specific components
│   │   │   │   ├── DashboardCard.jsx
│   │   │   │   ├── DashboardCards.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── RecentActivity.jsx
│   │   │   │   └── WelcomeSection.jsx
│   │   │   └── page.jsx   # Main dashboard page
│   │   ├── globals.css    # Global styles
│   │   ├── layout.js      # Root layout component
│   │   └── page.js        # Landing page
│   └── lib/               # Utility functions and configurations
│       └── supabaseClient.js # Supabase client configuration
├── .env.local             # Environment variables (create this)
├── .gitignore            # Git ignore rules
├── eslint.config.mjs     # ESLint configuration
├── jsconfig.json         # JavaScript configuration
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## Contributing Guidelines

We welcome contributions to improve the JamiiFund Dashboard! Here's how you can contribute:

### Getting Started
1. Fork the repository
2. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
3. Make your changes following the existing code style
4. Test your changes thoroughly
5. Commit your changes: `git commit -m "Add your meaningful commit message"`
6. Push to your branch: `git push origin feature/your-feature-name`
7. Create a Pull Request

### Development Standards
- Follow the existing code style and conventions
- Write clear, meaningful commit messages
- Add comments for complex logic
- Ensure responsive design compatibility
- Test your changes across different screen sizes
- Update documentation when necessary

### Reporting Issues
- Use the GitHub Issues tab to report bugs
- Provide detailed descriptions and steps to reproduce
- Include screenshots for UI-related issues

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact/Support

- **Project Maintainer**: [salumusabri05](https://github.com/salumusabri05)
- **Repository**: [https://github.com/salumusabri05/jamiifund_dashboard](https://github.com/salumusabri05/jamiifund_dashboard)
- **Issues**: [GitHub Issues](https://github.com/salumusabri05/jamiifund_dashboard/issues)

For support or questions:
- Open an issue on GitHub
- Contact the maintainer through GitHub
- Check existing documentation and issues for solutions

---

Built with ❤️ for community fund management
