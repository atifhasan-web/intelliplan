
"use client";

import { useState, useEffect, useRef } from 'react';
import { useTasks, Task } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, BellRing, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { useSession } from '@/hooks/use-session';

type Reminder = {
    id: number;
    taskId: number;
    taskTitle: string;
    reminderTime: string; // ISO string
};

const TimeRemaining = ({ targetDate }: { targetDate: string }) => {
    const [remaining, setRemaining] = useState('');

    useEffect(() => {
        const calculateRemaining = () => {
            const distance = formatDistanceToNow(new Date(targetDate), { addSuffix: true });
            setRemaining(distance);
        };

        calculateRemaining();
        const interval = setInterval(calculateRemaining, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [targetDate]);

    return <span className="text-xs text-muted-foreground ml-1">({remaining})</span>;
};


export default function ReminderPage() {
    const { tasks } = useTasks();
    const { user } = useSession();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [reminderDate, setReminderDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    
    // Time state
    const getInitialTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1);

        const initialHour24 = now.getHours();
        const initialHour12 = initialHour24 % 12 || 12;
        const initialMinute = now.getMinutes();
        const initialAmPm = initialHour24 >= 12 ? 'PM' : 'AM';
        
        return {
            hour: String(initialHour12),
            minute: String(initialMinute).padStart(2, '0'),
            ampm: initialAmPm,
        };
    }
    
    const [hour, setHour] = useState<string>(getInitialTime().hour);
    const [minute, setMinute] = useState<string>(getInitialTime().minute);
    const [ampm, setAmPm] = useState<string>(getInitialTime().ampm);
    
    const { toast } = useToast();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const getRemindersKey = () => `reminders_${user?.uid}`;

    // Load reminders from localStorage
    useEffect(() => {
        if (user) {
            try {
                const storedReminders = localStorage.getItem(getRemindersKey());
                if (storedReminders) {
                    setReminders(JSON.parse(storedReminders));
                }
            } catch (error) {
                console.error("Failed to load reminders", error);
            }
            finally {
                setIsLoaded(true);
            }
        }
    }, [user]);

    // Save reminders to localStorage
    useEffect(() => {
        if (user && isLoaded) {
            try {
                localStorage.setItem(getRemindersKey(), JSON.stringify(reminders));
            } catch (error) {
                console.error("Failed to save reminders", error);
            }
        }
    }, [reminders, user, isLoaded]);

    // Check for due reminders every second
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            reminders.forEach(reminder => {
                const reminderDateTime = new Date(reminder.reminderTime);
                if (now >= reminderDateTime) {
                    triggerReminder(reminder);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reminders]);

    // Request notification permission
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if(permission === 'granted') {
                        toast({ title: "Notifications enabled!", description: "You'll now receive system notifications for your reminders."})
                    }
                });
            }
        }
        // Pre-load the audio
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('https://proxy.gd.workers.dev/https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        }
    }, [toast]);

    const triggerReminder = (reminder: Reminder) => {
        toast({
            title: "🔔 Reminder!",
            description: `It's time for your task: ${reminder.taskTitle}`,
        });

        // Play sound
        audioRef.current?.play().catch(e => console.error("Audio playback failed:", e));

        // Show notification
        if (Notification.permission === "granted") {
            try {
                 new Notification("IntelliPlan Reminder", {
                    body: `It's time for: ${reminder.taskTitle}`,
                    icon: '/logo.png' 
                });
            } catch (error) {
                console.error("Error showing notification:", error);
            }
        }

        // Remove the reminder after it's triggered
        deleteReminder(reminder.id);
    };


    const handleSetReminder = () => {
        if (!selectedTaskId) {
            toast({ variant: 'destructive', title: 'No Task Selected', description: 'Please select a task to set a reminder.' });
            return;
        }

        if (Notification.permission === "denied") {
             // Silently continue if denied
        } else if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        const task = tasks.find(t => t.id === parseInt(selectedTaskId, 10));
        if (!task) return;

        // Convert 12-hour format to 24-hour
        let hour24 = parseInt(hour, 10);
        if (ampm === 'PM' && hour24 < 12) {
            hour24 += 12;
        }
        if (ampm === 'AM' && hour24 === 12) { // Midnight case
            hour24 = 0;
        }

        const reminderDateTimeString = `${reminderDate}T${String(hour24).padStart(2, '0')}:${minute}:00`;
        const reminderDateTime = new Date(reminderDateTimeString);

        if (reminderDateTime <= new Date()) {
             toast({ variant: 'destructive', title: 'Invalid Time', description: 'Cannot set a reminder for a past time.' });
            return;
        }
        
        const newReminder: Reminder = {
            id: Date.now(),
            taskId: task.id,
            taskTitle: task.title,
            reminderTime: reminderDateTime.toISOString(),
        };

        setReminders([...reminders, newReminder]);
        toast({ title: 'Reminder Set!', description: `You will be reminded for "${task.title}".` });
    };

    const deleteReminder = (id: number) => {
        setReminders(reminders.filter(r => r.id !== id));
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Set a New Reminder</CardTitle>
                    <CardDescription>Select a task and a time. We'll alert you when it's due.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                         <div className="space-y-2 md:col-span-5">
                            <Label htmlFor="task-select">Task</Label>
                            <Select onValueChange={setSelectedTaskId} value={selectedTaskId ?? undefined}>
                                <SelectTrigger id="task-select">
                                    <SelectValue placeholder="Select a task..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {tasks.filter(t => !t.completed).map(task => (
                                        <SelectItem key={task.id} value={String(task.id)}>{task.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="reminder-date">Date</Label>
                            <Input id="reminder-date" type="date" value={reminderDate} onChange={e => setReminderDate(e.target.value)} />
                        </div>
                        <div className="space-y-2 md:col-span-1">
                            <Label htmlFor="reminder-hour">Hour</Label>
                            <Select onValueChange={setHour} value={hour}>
                                <SelectTrigger id="reminder-hour"><SelectValue /></SelectTrigger>
                                <SelectContent position="popper">
                                    {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(h => (
                                        <SelectItem key={h} value={h}>{h}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-1">
                            <Label htmlFor="reminder-minute">Min</Label>
                            <Select onValueChange={setMinute} value={minute}>
                                <SelectTrigger id="reminder-minute"><SelectValue /></SelectTrigger>
                                <SelectContent position="popper">
                                    {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                             <Label htmlFor="reminder-ampm" className="hidden md:block">&nbsp;</Label>
                            <Select onValueChange={setAmPm} value={ampm}>
                                <SelectTrigger id="reminder-ampm"><SelectValue /></SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="AM">AM</SelectItem>
                                    <SelectItem value="PM">PM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleSetReminder} className="w-full md:w-auto md:self-end mt-2">
                        <Bell className="mr-2 h-4 w-4" /> Set Reminder
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Reminders</CardTitle>
                    <CardDescription>These are your scheduled alerts.</CardDescription>
                </CardHeader>
                <CardContent>
                    {reminders.length > 0 ? (
                        <ul className="space-y-4">
                            {reminders.sort((a, b) => new Date(a.reminderTime).getTime() - new Date(b.reminderTime).getTime()).map(reminder => (
                                <li key={reminder.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className='flex items-center gap-4'>
                                        <BellRing className="text-primary" />
                                        <div>
                                            <p className="font-semibold">{reminder.taskTitle}</p>
                                            <p className="text-sm text-muted-foreground flex items-center">
                                                {format(new Date(reminder.reminderTime), "PPP 'at' p")}
                                                <TimeRemaining targetDate={reminder.reminderTime} />
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id)}>
                                        <Trash2 className="h-5 w-5 text-destructive" />
                                        <span className='sr-only'>Delete Reminder</span>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <Bell className="mx-auto h-12 w-12" />
                            <p className="mt-4">No upcoming reminders.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
