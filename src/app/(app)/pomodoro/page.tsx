
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Settings, BellRing } from "lucide-react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { usePomodoro } from "@/hooks/use-pomodoro";
import { useState } from "react";

export default function PomodoroPage() {
    const { 
        minutes, seconds, mode, isActive, sessionCount, sessionsUntilLongBreak,
        focusDuration, shortBreakDuration, longBreakDuration,
        getModeName, toggleTimer, resetTimer, switchMode, setSettings
    } = usePomodoro();

    const [tempSettings, setTempSettings] = useState({
        focusDuration,
        shortBreakDuration,
        longBreakDuration,
        sessionsUntilLongBreak,
    });
    
    const handleSettingsSave = () => {
        setSettings(tempSettings);
    };
    
    const totalDurationInSeconds = (
        (mode === 'focus' ? focusDuration :
         mode === 'shortBreak' ? shortBreakDuration :
         longBreakDuration) * 60
    );
    
    const remainingSeconds = minutes * 60 + seconds;
    const progress = totalDurationInSeconds > 0 ? (totalDurationInSeconds - remainingSeconds) / totalDurationInSeconds * 100 : 0;

    return (
        <div className="flex flex-col items-center justify-start pt-10 h-full gap-8">
            <Card className="w-full max-w-md">
                <CardHeader className="items-center">
                    <CardTitle className="text-center text-2xl">Pomodoro Timer</CardTitle>
                    <CardDescription>Stay focused, take breaks, be productive.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative w-64 h-64">
                         <CircularProgressbar
                            value={progress}
                            strokeWidth={8}
                            styles={buildStyles({
                                rotation: 0.25,
                                strokeLinecap: 'round',
                                trailColor: 'hsl(var(--muted))',
                                pathColor: `hsl(var(--primary))`,
                                textColor: `hsl(var(--foreground))`,
                            })}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-5xl font-bold font-mono text-primary">
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </div>
                            <p className="text-muted-foreground mt-2">{getModeName()}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Button onClick={toggleTimer} size="lg" className="w-32">
                            {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                            {isActive ? 'Pause' : 'Start'}
                        </Button>
                        <Button onClick={() => resetTimer()} variant="outline" size="icon">
                            <RotateCcw />
                            <span className="sr-only">Reset Timer</span>
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Settings />
                                    <span className="sr-only">Settings</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Timer Settings</DialogTitle>
                                    <DialogDescription>Customize your Pomodoro intervals.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="focus" className="text-right">Focus</Label>
                                        <Input id="focus" type="number" value={tempSettings.focusDuration} onChange={(e) => setTempSettings(s => ({...s, focusDuration: Number(e.target.value)}))} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="short-break" className="text-right">Short Break</Label>
                                        <Input id="short-break" type="number" value={tempSettings.shortBreakDuration} onChange={(e) => setTempSettings(s => ({...s, shortBreakDuration: Number(e.target.value)}))} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="long-break" className="text-right">Long Break</Label>
                                        <Input id="long-break" type="number" value={tempSettings.longBreakDuration} onChange={(e) => setTempSettings(s => ({...s, longBreakDuration: Number(e.target.value)}))} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="sessions" className="text-right">Sessions</Label>
                                        <Input id="sessions" type="number" value={tempSettings.sessionsUntilLongBreak} onChange={(e) => setTempSettings(s => ({...s, sessionsUntilLongBreak: Number(e.target.value)}))} className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" onClick={handleSettingsSave}>Save</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant={mode === 'focus' ? 'secondary' : 'ghost'} onClick={() => switchMode('focus')}>Focus</Button>
                        <Button variant={mode === 'shortBreak' ? 'secondary' : 'ghost'} onClick={() => switchMode('shortBreak')}>Short Break</Button>
                        <Button variant={mode === 'longBreak' ? 'secondary' : 'ghost'} onClick={() => switchMode('longBreak')}>Long Break</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-md">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BellRing className="h-5 w-5"/>
                        Session Info
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground">
                        You have completed <span className="font-bold text-primary">{sessionCount}</span> focus session(s).
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        {sessionsUntilLongBreak - (sessionCount % sessionsUntilLongBreak)} more sessions until a long break.
                    </p>
                 </CardContent>
            </Card>
        </div>
    );
}
