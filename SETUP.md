# Bengal Bay - Setup Instructions

## Prerequisites
- Node.js (v16 or newer)
- npm or yarn

## Setup Steps

1. **Clone or download the project**
   - If you downloaded a zip file, extract it to a folder

2. **Install dependencies**
   ```bash
   npm install
   # or if you use yarn
   yarn
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory with your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
   - You can get these values from your Firebase project settings

4. **Start the development server**
   ```bash
   npm run dev
   # or if you use yarn
   yarn dev
   ```

5. **Open the application**
   - Navigate to `http://localhost:5173` in your browser

## Project Structure

- `/src` - Main source code
  - `/components` - React components
  - `/contexts` - Context providers (like AuthContext)
  - `/lib` - Utility functions and configurations
  - `/pages` - Page components
  - `/utils` - Helper utilities

- `/public` - Static assets
  - `/assets/images` - Image files organized by category

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- Firebase Authentication
- React Router

## Notes

- The project uses Firebase for authentication. You'll need to create a Firebase project and enable Email/Password authentication.
- All image assets are stored in the `/public/assets/images` directory.
- The project is configured to use Tailwind CSS for styling.

EOL ; npm install && echo 'Tempo: Node Modules Installed' ; npm run dev -- --host 0.0.0.0 --port 3000
