
"use client";

import React, { createContext, useState, useContext, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

type Mode = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
}

interface PomodoroState extends PomodoroSettings {
    minutes: number;
    seconds: number;
    isActive: boolean;
    mode: Mode;
    sessionCount: number;
}

interface PomodoroActions {
    toggleTimer: () => void;
    resetTimer: (newMode?: Mode) => void;
    switchMode: (newMode: Mode) => void;
    setSettings: (settings: Partial<PomodoroSettings>) => void;
    getModeName: () => string;
}

const PomodoroContext = createContext<(PomodoroState & PomodoroActions) | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [settings, setSettingsState] = useState<PomodoroSettings>(() => {
        if (typeof window !== 'undefined') {
            const savedSettings = localStorage.getItem('pomodoroSettings');
            if (savedSettings) return JSON.parse(savedSettings);
        }
        return {
            focusDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            sessionsUntilLongBreak: 4,
        };
    });

    const [state, setState] = useState<Omit<PomodoroState, keyof PomodoroSettings>>({
        minutes: settings.focusDuration,
        seconds: 0,
        isActive: false,
        mode: 'focus',
        sessionCount: 0,
    });
    
    const { minutes, seconds, isActive, mode, sessionCount } = state;
    const { focusDuration, shortBreakDuration, longBreakDuration, sessionsUntilLongBreak } = settings;


    const getModeName = useCallback(() => {
        switch (mode) {
            case 'focus': return "Focus";
            case 'shortBreak': return "Short Break";
            case 'longBreak': return "Long Break";
            default: return "Pomodoro Timer";
        }
    }, [mode]);

    const triggerNotification = useCallback(() => {
        const notificationText = mode === 'focus' 
            ? "Time for a break!" 
            : "Time to get back to focus!";

        toast({
            title: `🔔 ${getModeName()} Finished!`,
            description: notificationText,
        });

        audioRef.current?.play().catch(e => console.error("Audio playback failed:", e));

        if (Notification.permission === "granted") {
            try {
                new Notification("Pomodoro Timer", {
                    body: notificationText,
                    icon: '/logo.png',
                });
            } catch (error) {
                console.error("Error showing notification:", error);
            }
        }
    }, [mode, toast, getModeName]);

    const switchMode = useCallback((newMode: Mode) => {
        setState(s => ({ ...s, isActive: false, mode: newMode }));
        
        if (newMode === 'focus') {
             setState(s => ({ ...s, minutes: settings.focusDuration, seconds: 0 }));
        } else if (newMode === 'shortBreak') {
             setState(s => ({ ...s, minutes: settings.shortBreakDuration, seconds: 0 }));
        } else if (newMode === 'longBreak') {
             setState(s => ({ ...s, minutes: settings.longBreakDuration, seconds: 0 }));
        }
    }, [settings]);

    
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive) {
            interval = setInterval(() => {
                setState(s => {
                    if (s.seconds > 0) {
                        return { ...s, seconds: s.seconds - 1 };
                    }
                    if (s.minutes > 0) {
                        return { ...s, minutes: s.minutes - 1, seconds: 59 };
                    }
                    
                    triggerNotification();

                    if (s.mode === 'focus') {
                        const newSessionCount = s.sessionCount + 1;
                        if (newSessionCount % settings.sessionsUntilLongBreak === 0) {
                            switchMode('longBreak');
                        } else {
                            switchMode('shortBreak');
                        }
                        return { ...s, sessionCount: newSessionCount, isActive: false };
                    } else {
                        switchMode('focus');
                        return { ...s, isActive: false };
                    }
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, triggerNotification, switchMode, settings.sessionsUntilLongBreak]);

     useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('https://proxy.gd.workers.dev/https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            if (Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        }
        // When settings change, reset the timer to the new duration if it's not active
        if(!isActive) {
            switchMode(mode);
        }
    }, [settings, isActive, mode, switchMode]);


    const toggleTimer = () => {
        setState(s => ({ ...s, isActive: !s.isActive }));
    };

    const resetTimer = useCallback((newMode = mode) => {
        switchMode(newMode);
    }, [mode, switchMode]);

    const setSettingsCallback = (newSettings: Partial<PomodoroSettings>) => {
        setSettingsState(s => ({ ...s, ...newSettings }));
    };

    const value = { 
        ...state, ...settings, 
        toggleTimer, resetTimer, switchMode, 
        setSettings: setSettingsCallback, 
        getModeName 
    };

    return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro() {
    const context = useContext(PomodoroContext);
    if (context === undefined) {
        throw new Error('usePomodoro must be used within a PomodoroProvider');
    }
    return context;
}
