
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Slider } from "@/components/ui/slider";

type Goal = {
  id: number;
  subject: string;
  title: string;
  progress: number;
  target: string;
};

type GoalFormInput = Omit<Goal, 'id'>;

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<GoalFormInput>({
        defaultValues: {
            progress: 0,
        }
    });

    useEffect(() => {
        try {
            const storedGoals = localStorage.getItem('goals');
            if (storedGoals) {
                setGoals(JSON.parse(storedGoals));
            }
        } catch (error) {
            console.error("Failed to load goals from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if(isLoaded){
            try {
                localStorage.setItem('goals', JSON.stringify(goals));
            } catch (error) {
                console.error("Failed to save goals to localStorage", error);
            }
        }
    }, [goals, isLoaded]);

    const progressValue = watch('progress');

    const onSubmit: SubmitHandler<GoalFormInput> = (data) => {
        if (editingGoal) {
            setGoals(goals.map(g => g.id === editingGoal.id ? { ...editingGoal, ...data } : g));
        } else {
            const newGoal: Goal = {
                id: Date.now(),
                ...data
            };
            setGoals([...goals, newGoal]);
        }
        resetForm();
    };

    const deleteGoal = (id: number) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const resetForm = () => {
        reset({ title: "", subject: "", target: "", progress: 0 });
        setEditingGoal(null);
        setIsDialogOpen(false);
    }

    const openDialog = (goal: Goal | null) => {
        if (goal) {
            setEditingGoal(goal);
            setValue("title", goal.title);
            setValue("subject", goal.subject);
            setValue("target", goal.target);
            setValue("progress", goal.progress);
        } else {
            setEditingGoal(null);
            reset({ title: "", subject: "", target: "", progress: 0 });
        }
        setIsDialogOpen(true);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Academic Goals</h1>
                    <p className="text-muted-foreground">Set and track your goals for each subject.</p>
                </div>
                <Button onClick={() => openDialog(null)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Goal
                </Button>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                if (!isOpen) {
                    resetForm();
                }
                setIsDialogOpen(isOpen);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingGoal ? "Edit Goal" : "Create a New Goal"}</DialogTitle>
                        <DialogDescription>
                            {editingGoal ? "Update the details of your academic goal." : "What do you want to achieve? Set a new academic goal."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Goal Title</Label>
                                <Input id="title" placeholder="e.g., Master Calculus II" {...register("title", { required: "Title is required" })} />
                                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="e.g., Mathematics" {...register("subject", { required: "Subject is required" })} />
                                {errors.subject && <p className="text-destructive text-sm">{errors.subject.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="target">Target</Label>
                                <Input id="target" placeholder="e.g., A+ or Complete" {...register("target", { required: "Target is required" })} />
                                {errors.target && <p className="text-destructive text-sm">{errors.target.message}</p>}
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="progress">Progress ({progressValue}%)</Label>
                                <Slider
                                    id="progress"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[progressValue]}
                                    onValueChange={(value) => setValue('progress', value[0])}
                                />
                            </div>
                           
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                            <Button type="submit">{editingGoal ? "Save Changes" : "Save Goal"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                    <Card key={goal.id}>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle>{goal.title}</CardTitle>
                                <CardDescription>{goal.subject}</CardDescription>
                            </div>
                             <Button variant="ghost" size="icon" className="shrink-0" onClick={() => deleteGoal(goal.id)}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                                <span className="sr-only">Delete goal</span>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Progress value={goal.progress} aria-label={`${goal.progress}% complete`} />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{goal.progress}% complete</span>
                                    <span>Target: {goal.target}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                             <Button variant="secondary" className="w-full" onClick={() => openDialog(goal)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Goal
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {goals.length === 0 && (
                    <Card 
                        onClick={() => openDialog(null)}
                        className="flex items-center justify-center border-dashed min-h-[250px] cursor-pointer hover:border-primary/50 transition-colors col-span-full md:col-span-1"
                    >
                        <div className="flex flex-col items-center">
                            <PlusCircle className="h-8 w-8 text-muted-foreground" />
                            <span className="mt-2 text-sm text-muted-foreground">Add New Goal</span>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
