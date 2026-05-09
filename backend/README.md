# Smart Grievance System - Backend Setup

The backend for the Smart Grievance System has been completely set up with an industry-standard Express.js structure.

## Features Included
- **Express.js server**: Split into `server.js` (entry point) and `src/app.js` (app configuration).
- **CORS setup**: Handled via the `cors` middleware in `app.js`.
- **dotenv configuration**: Handled at the top of `server.js` using `.env`.
- **JSON middleware**: Included via `express.json()` and `express.urlencoded()`.
- **Nodemon configuration**: Installed as a dev dependency, with a `dev` script in `package.json`.
- **Proper server structure**: Organized into `src/controllers`, `src/routes`, `src/models`, `src/middleware`, `src/config`, `src/utils`, and `src/services`.
- **Error handling middleware**: A global error handler is implemented at the bottom of `app.js`.
- **PORT configuration**: Defaults to `5000` via `.env` or process environment variables.

## How to Run

1. Make sure you are in the `backend` directory:
   ```bash
   cd backend
   ```
2. Start the development server (auto-restarts on file changes):
   ```bash
   npm run dev
   ```
3. (Optional) For production, start the standard Node server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in your `.env`).
