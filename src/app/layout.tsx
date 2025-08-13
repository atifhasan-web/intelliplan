
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from '@/hooks/use-session';

export const metadata: Metadata = {
  title: 'IntelliPlan - Your Smart Study Companion',
  description: 'A focused study companion app to help students track and manage their academic progress with a Pomodoro timer, task management, and an AI schedule generator.',
  keywords: ['study planner', 'pomodoro timer', 'task manager', 'student productivity', 'ai schedule', 'nextjs', 'react', 'firebase'],
  authors: [{ name: 'Atif Hasan', url: 'https://atifs-info.vercel.app/' }],
  openGraph: {
    title: 'IntelliPlan - Your Smart Study Companion',
    description: 'Boost your productivity with IntelliPlan. Manage tasks, use the Pomodoro timer, and get AI-generated study schedules.',
    images: ['/og-image.png'],
    url: 'https://intelliplan.vercel.app/', // Replace with your actual deployed URL
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IntelliPlan - Your Smart Study Companion',
    description: 'Boost your productivity with IntelliPlan. Manage tasks, use the Pomodoro timer, and get AI-generated study schedules.',
    images: ['/og-image.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head />
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
