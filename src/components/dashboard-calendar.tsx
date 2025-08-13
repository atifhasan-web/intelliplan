
"use client";
import { Calendar } from "@/components/ui/calendar";

interface DashboardCalendarProps {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
}

export function DashboardCalendar({ date, onDateChange }: DashboardCalendarProps) {
    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            className="rounded-md border"
        />
    )
}
