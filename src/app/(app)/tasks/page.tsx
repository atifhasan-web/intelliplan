
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { File, MoreHorizontal, PlusCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { useTasks, Task, TaskFormInput } from "@/hooks/use-tasks";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { cn } from "@/lib/utils";

export default function TasksPage() {
    const { tasks, addTask, editTask, deleteTask, toggleTaskComplete } = useTasks();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { toast } = useToast();

    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<TaskFormInput>();

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });
    }, [tasks]);

    const onSubmit: SubmitHandler<TaskFormInput> = (data) => {
        if (editingTask) {
            editTask(editingTask.id, data);
            toast({ title: "Task Updated", description: "Your task has been successfully updated." });
        } else {
            addTask(data);
            toast({ title: "Task Added", description: "Your new task has been successfully added." });
        }
        closeDialog();
    };

    const openDialog = (task: Task | null) => {
        if (task) {
            setEditingTask(task);
            setValue("title", task.title);
            setValue("subject", task.subject);
            setValue("dueDate", task.dueDate);
            setValue("priority", task.priority);
        } else {
            const today = format(new Date(), 'yyyy-MM-dd');
            reset({ title: "", subject: "", dueDate: today, priority: "Medium" });
        }
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setEditingTask(null);
        reset();
        setIsDialogOpen(false);
    };
    
    const handleDelete = (taskId: number) => {
        deleteTask(taskId);
        toast({ title: "Task Deleted", variant: "destructive", description: "Your task has been successfully deleted." });
    };

    const handleExport = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("Task List", 14, 22);

        const tableColumn = ["Title", "Subject", "Priority", "Due Date", "Status"];
        const tableRows = tasks.map(task => [
            task.title,
            task.subject,
            task.priority,
            format(parseISO(task.dueDate), 'PPP'),
            task.completed ? "Completed" : "Pending"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save("tasks.pdf");
        toast({
            title: "Export Successful",
            description: "Your tasks have been exported to tasks.pdf"
        });
    }

    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle>Task Manager</CardTitle>
                    <CardDescription>Manage your assignments, deadlines, and subjects.</CardDescription>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto">
                    <Button size="sm" variant="outline" onClick={handleExport}>
                        <File className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={() => openDialog(null)}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingTask ? "Edit Task" : "Create a New Task"}</DialogTitle>
                                <DialogDescription>
                                    Fill in the details for your task below.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)}>
                               <div className="max-h-[70vh] overflow-y-auto p-1">
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Task Title</Label>
                                            <Input id="title" {...register("title", { required: "Title is required" })} />
                                            {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" {...register("subject", { required: "Subject is required" })} />
                                            {errors.subject && <p className="text-destructive text-sm">{errors.subject.message}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="dueDate">Due Date</Label>
                                            <Input id="dueDate" type="date" {...register("dueDate", { required: "Due date is required" })} />
                                            {errors.dueDate && <p className="text-destructive text-sm">{errors.dueDate.message}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="priority">Priority</Label>
                                            <Controller
                                                name="priority"
                                                control={control}
                                                defaultValue="Medium"
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger id="priority">
                                                            <SelectValue placeholder="Select priority" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Low">Low</SelectItem>
                                                            <SelectItem value="Medium">Medium</SelectItem>
                                                            <SelectItem value="High">High</SelectItem>
                                                            <SelectItem value="Urgent">Urgent</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                               </div>
                                <DialogFooter className="mt-4">
                                    <Button type="button" variant="ghost" onClick={closeDialog}>Cancel</Button>
                                    <Button type="submit">{editingTask ? "Save Changes" : "Save Task"}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">Status</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTasks.length > 0 ? (
                            sortedTasks.map((task) => (
                                <TableRow key={task.id} data-state={task.completed ? "completed" : ""}>
                                    <TableCell>
                                        <Checkbox checked={task.completed} onCheckedChange={() => toggleTaskComplete(task.id)} aria-label={`Mark task as ${task.completed ? "incomplete" : "complete"}: ${task.title}`} />
                                    </TableCell>
                                    <TableCell className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>{task.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={task.priority === 'High' || task.priority === 'Urgent' ? 'destructive' : 'secondary'} className={cn(task.completed && "line-through text-muted-foreground")}>{task.priority}</Badge>
                                    </TableCell>
                                    <TableCell className={cn(task.completed && "line-through text-muted-foreground")}>{task.subject}</TableCell>
                                    <TableCell className={cn(task.completed && "line-through text-muted-foreground")}>{format(parseISO(task.dueDate), 'PPP')}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={task.completed}>
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => openDialog(task)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleTaskComplete(task.id)}>Mark as {task.completed ? "incomplete" : "complete"}</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(task.id)}>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No tasks yet. Add one to get started!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
