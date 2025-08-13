
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenCheck, CalendarClock, Target, BrainCircuit } from 'lucide-react';
import Image from 'next/image';

export default function Home() {

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <Link href="/" onClick={scrollToTop} className="flex items-center justify-center" prefetch={false}>
          <BookOpenCheck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="ml-2 font-bold text-lg sm:text-2xl">IntelliPlan</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" prefetch={false}>
            <Button variant="outline" className="border-primary/50">Login</Button>
          </Link>
          <Link href="/signup" prefetch={false}>
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center min-h-[calc(100dvh-3.5rem)]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 px-4 sm:px-0">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Achieve Your Academic Goals with IntelliPlan
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A focused study companion to help you track and manage your academic progress. From Pomodoro timers to AI-powered schedule generation, we've got you covered.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1548393488-ae8f117cbc1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8c3R1ZHl8ZW58MHx8fHwxNzU0OTkxMTk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                width="600"
                height="400"
                alt="A student studying at a desk with books and a laptop"
                data-ai-hint="focused student"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                priority
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/90">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  IntelliPlan provides a suite of tools designed to enhance your focus, organization, and academic performance.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold flex items-center gap-2"><CalendarClock className="h-5 w-5 text-primary" /> Pomodoro Timer & Tasks</h3>
                      <p className="text-muted-foreground">
                        Stay focused with our customizable Pomodoro timer and manage all your assignments in one place.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Goal Setting & Progress Tracking</h3>
                      <p className="text-muted-foreground">
                        Set subject-specific goals and visualize your study patterns to see how you improve over time.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" /> AI Schedule Generator</h3>
                      <p className="text-muted-foreground">
                        Let our AI create a personalized study schedule based on your goals, deadlines, and past performance.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1551914554-c94b92df45c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzdHVkeSUyMGRhcmt8ZW58MHx8fHwxNzU0OTkxMjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                width="600"
                height="550"
                alt="A collage of app screenshots showing different features"
                data-ai-hint="dashboard interface"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t">
        <p className="text-sm text-muted-foreground text-center">
          &copy; 2025 IntelliPlan. All rights reserved | developed by{' '}
          <a
            href="https://atifs-info.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline"
          >
            Atif Hasan
          </a>
        </p>
      </footer>
    </div>
  )
}
