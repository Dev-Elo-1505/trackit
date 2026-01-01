# TrackIt 🎯

**TrackIt** is a modern, meaningful habit tracker designed to help you build consistency and achieve your goals. Unlike simple checklists, TrackIt features a localized "Smart Coach" that analyzes your progress and offers personalized motivation to keep you on track.

## 🚀 Features

- **Habit Tracking** – Create and manage daily habits with custom goals.
- **Smart Coach Insights** – An intelligent, local algorithm that reviews your performance and provides tailored advice (Beginner, Struggling, or Mastery tips) without needing external AI APIs.
- **Interactive Dashboard** – Get a clear visual overview of your active habits and daily progress.
- **Secure Authentication** – Reliable login and signup functionality powered by Firebase.
- **Cloud Sync** – Your data is safely stored in Firestore, so you never lose your streak.
- **Modern UI/UX** – A polished, responsive interface built with Tailwind CSS 4 and React 19.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Data:** React Query, Context API
- **Routing:** React Router DOM v7
- **Forms:** React Hook Form + Zod Validation
- **Backend:** Firebase (Auth & Firestore)
- **Notifications:** Sonner (Toast notifications)

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- A Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/trackit.git
   cd trackit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_API_KEY=your_api_key
   VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_MESSAGING_SENDER_ID=your_sender_id
   VITE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🧠 How Smart Coach Works

The **Smart Coach** is a custom logic engine located in `src/lib/smartCoach.ts`. Instead of relying on expensive external APIs, it:
1. Calculates your completion rate for each habit.
2. Determines your current "stage" (Newcomer, Consistency Builder, or Master).
3. Selects the most relevant motivational quotes and tactical tips to help you overcome specific hurdles.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or improvements:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
