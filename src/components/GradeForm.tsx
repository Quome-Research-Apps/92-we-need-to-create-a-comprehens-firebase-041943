"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { gradeSchema } from "@/lib/schemas";
import { useData } from "@/contexts/data-context";
import type { Grade } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { calculateCourseGrade } from "@/lib/grade-utils";

type GradeFormValues = z.infer<typeof gradeSchema>;

interface GradeFormProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  grade?: Grade;
}

export function GradeForm({ children, open, onOpenChange, courseId, grade }: GradeFormProps) {
  const { addGrade, updateGrade, getCourseById } = useData();
  const { toast } = useToast();
  const isEditing = !!grade;
  const course = getCourseById(courseId);
  const { weightCompleted } = calculateCourseGrade(course?.grades || []);

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      name: "",
      score: 85,
      weight: 10,
    },
  });

  useEffect(() => {
    if (open) {
        if (grade) {
          form.reset(grade);
        } else {
          form.reset({
            name: "",
            score: 85,
            weight: 10,
          });
        }
    }
  }, [grade, open, form]);

  function onSubmit(data: GradeFormValues) {
    const currentWeight = isEditing ? grade.weight : 0;
    if (weightCompleted - currentWeight + data.weight > 100) {
        form.setError("weight", {
            type: "manual",
            message: `Total weight cannot exceed 100%. Remaining weight available: ${100 - (weightCompleted - currentWeight)}%`
        });
        return;
    }

    if (isEditing) {
      updateGrade(courseId, grade.id, data);
      toast({
        title: "Grade Updated",
        description: `Grade for "${data.name}" has been successfully updated.`,
      });
    } else {
      addGrade(courseId, data);
      toast({
        title: "Grade Added",
        description: `Grade for "${data.name}" has been added.`,
      });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Grade" : "Add New Grade"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for this grade." : `Enter the details for a new grade. ${100-weightCompleted}% weight remaining.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Midterm Exam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 88.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">{isEditing ? "Save Changes" : "Add Grade"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
