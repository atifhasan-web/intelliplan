# IntelliPlan

IntelliPlan is a modern, responsive web application designed to help students organize their study schedules, track their progress, and stay focused on their academic goals. It provides a comprehensive suite of tools including a Pomodoro timer, task management, goal setting, and an AI-powered schedule generator to create a personalized learning experience.


## Key Features

- **Dashboard:** A central hub for a snapshot of your study activities, including today's tasks and a study calendar.
- **Task Manager:** Create, track, and manage your academic tasks and assignments with priorities and due dates.
- **Pomodoro Timer:** A customizable Pomodoro timer to help you stay focused during study sessions and take effective breaks.
- **Goal Setting:** Define and monitor your academic goals for different subjects to stay motivated and on track.
- **Secure Authentication:** Easy and secure sign-up and login functionality using Firebase Authentication with support for email/password and Google Sign-In.
- **Responsive Design:** A fully responsive user interface that works seamlessly across desktops, tablets, and mobile devices.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) components
- **Backend & Authentication:** [Firebase](https://firebase.google.com/)
- **Deployment:** Vercel

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Atifhasan250/intelliplan.git
    cd intelliplan
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Firebase:**
    - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    - Obtain your Firebase project's configuration object.
    - Update the `firebaseConfig` object in `src/lib/firebase.ts` with your project's credentials.
    - In the Firebase Console, go to **Authentication > Sign-in method** and enable the **Email/Password** and **Google** providers.
    - Go to **Authentication > Settings > Authorized domains** and add the domains you will be using for development (e.g., `localhost`).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
