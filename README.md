# EventMaker

EventMaker is a modern web application for creating and joining events easily using just an email address. Built with Next.js, React, and TypeScript, it provides a seamless event management experience with magic link authentication for enhanced security.

![EventMaker Screenshot](https://via.placeholder.com/800x400?text=EventMaker+Screenshot)

## Features

- **Simple Email Authentication**: Sign in with a magic link - no passwords required
- **Create Events**: Easily create events with title, description, location, date, time, and capacity
- **Join Events**: Join events with a simple 6-character code
- **Responsive Design**: Beautiful UI that works on desktop and mobile
- **Dashboard**: Manage your events and attendances in one place

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS, Heroicons
- **Form Validation**: Zod
- **Hosting**: Optimized for Netlify deployment

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eventmaker.git
   cd eventmaker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following environment variables:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/eventmaker"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Email Server (for magic link authentication)
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@example.com"
   EMAIL_SERVER_PASSWORD="your-email-password"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Authentication

1. Click "Sign In" from the homepage
2. Enter your email address
3. Check your email for a magic link
4. Click the link to sign in automatically

### Creating Events

1. Sign in to your account
2. Go to the dashboard
3. Click "Create New Event"
4. Fill out the event details (title, description, date, time, location, capacity)
5. Click "Create Event"
6. Share the generated event code with attendees

### Joining Events

1. From the homepage, click "Join Event"
2. Enter the 6-character event code
3. View the event details
4. Click "Join This Event" to confirm your attendance

## Deployment on Netlify

1. Push your code to a GitHub repository
2. Connect your Netlify account to your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Set up the environment variables in the Netlify dashboard
5. Deploy your application

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | URL of your application (e.g., http://localhost:3000 for dev) |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js encryption |
| `EMAIL_SERVER_HOST` | SMTP server host for sending emails |
| `EMAIL_SERVER_PORT` | SMTP server port |
| `EMAIL_SERVER_USER` | SMTP server username |
| `EMAIL_SERVER_PASSWORD` | SMTP server password |
| `EMAIL_FROM` | Email address to send from |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [Heroicons](https://heroicons.com/)
- [Zod](https://github.com/colinhacks/zod)
