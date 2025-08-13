
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { DashboardCalendar } from "@/components/dashboard-calendar";
import { useSearch } from "@/hooks/use-search";
import { format, isToday, isSameDay, parseISO } from 'date-fns';
import { useTasks } from "@/hooks/use-tasks";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
    const { tasks } = useTasks();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const { searchQuery } = useSearch();
    const router = useRouter();

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.subject.toLowerCase().includes(searchQuery.toLowerCase());
        
        const taskDueDate = parseISO(task.dueDate);
        const matchesDate = selectedDate ? isSameDay(taskDueDate, selectedDate) : isToday(taskDueDate);
        
        return matchesSearch && matchesDate;
    });

    const getDueDateDisplay = (dueDate: string) => {
      const date = parseISO(dueDate);
      if (isToday(date)) return "Today";
      return format(date, 'MMM d');
    }

    const cardTitle = selectedDate ? `Tasks for ${format(selectedDate, 'MMMM do')}` : "Today's Tasks";
    const cardDescription = selectedDate ? 'Assignments and study sessions for the selected day.' : 'Assignments and study sessions scheduled for today.';


    return (
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 lg:items-stretch">
            <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>{cardTitle}</CardTitle>
                        <CardDescription>
                           {cardDescription}
                        </CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/tasks">
                            View All
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="flex-grow">
                    {filteredTasks.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task</TableHead>
                                    <TableHead className="hidden sm:table-cell">Subject</TableHead>
                                    <TableHead className="hidden sm:table-cell">Priority</TableHead>
                                    <TableHead className="text-right">Due</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <div className="font-medium">{task.title}</div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant="outline">{task.subject}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant={task.priority === 'High' || task.priority === 'Urgent' ? 'destructive' : 'secondary'}>{task.priority}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{getDueDateDisplay(task.dueDate)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full flex-grow">
                            <p className="text-muted-foreground mb-4">
                                {searchQuery ? `No tasks found for "${searchQuery}".` : "No tasks for the selected day. Add one!"}
                            </p>
                            <Button onClick={() => router.push('/tasks')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Task
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle>Study Calendar</CardTitle>
                    <CardDescription>
                        Your deadlines and study sessions at a glance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center flex-grow items-center">
                    <DashboardCalendar date={selectedDate} onDateChange={setSelectedDate} />
                </CardContent>
            </Card>
        </div>
    );
}
