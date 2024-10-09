# Litekite Frontend

This is the frontend repository for Litekite - an end-to-end mock stock exchange application. Users can trade stocks according to real-time prices with added AI support using the Gemini API.

## Features

- User authentication (login/signup)
- Real-time stock price tracking
- Buy and sell stocks
- View portfolio and transaction history
- AI-powered stock analysis using Gemini API and real-time stock information.
- Responsive design for desktop and mobile devices

## Technologies Used

- React
- Vite
- TypeScript
- Tailwind CSS
- Shadcn UI

## Setup

Follow these steps to set up the project locally:

1. Clone the repository:
   ```
   git clone https://github.com/akshatg5/LiteKite.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   VITE_BACKEND_URL=http://127.0.0.1:5000/api
   ```
   Replace the URL with your backend server URL if different.

4. Set up and run the backend server:
   - Clone the backend repository: https://github.com/akshatg5/Finance-CS50
   - Follow the setup instructions in the backend README
   - Start the backend server

5. Start the development server:
   ```
   npm run dev
   ```

The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

## Contributing

Contributions to Litekite Frontend are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/featureName`)
3. Make your changes
4. Commit your changes (`git commit -m 'feat/fix:featureName'`)
5. Push to the branch (`git push origin feature/featureName`)
6. Open a Pull Request
## Contact

If you have any questions or feedback, please reach out to [your-email@example.com](https://x.com/AkshatGirdhar2).
